/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
/* eslint-disable react/no-multi-comp */
/* eslint-disable import/no-cycle */
import React, { useState, useEffect } from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import InputBase from '@material-ui/core/InputBase';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { RxDatabase, RxDocument } from 'rxdb';
import { FormikProps, useFormikContext } from 'formik';
import { useHistory } from 'react-router';
import { NombreTickets, PrincipalValues, SetState } from '../../../types/types';
import ArticulosEscaner from '../../../formPartials/ArticulosEscaner';
import { AgregarFormProps } from './AgregarForm';
import { Productos_productos_productos } from '../../../types/apollo';
import * as Database from '../../../Database';
import { obtenerPrincipalValues } from '../../../utils/functions';

interface TicketsProps {
  setTotal: SetState<number>;
  opcionesArticulos: Productos_productos_productos[];
  formikProps: FormikProps<PrincipalValues>;
  agregarFormProps: AgregarFormProps;
  intercambioOpen: boolean;
  codigoStr: string;
  db: RxDatabase<Database.db>;
  setCodigoStr: SetState<string>;
  nombresTickets: NombreTickets[];
  setNombresTickets: SetState<NombreTickets[]>;
  docTicket: RxDocument<Database.TicketDb> | null;
  setDocTicket: SetState<RxDocument<Database.TicketDb> | null>;
  docIntercambio: RxDocument<
    Database.intercambioDB | Database.registroInventarioDB
  > | null;
}
const Tickets = (props: TicketsProps): JSX.Element => {
  const {
    setTotal,
    setCodigoStr,
    opcionesArticulos,
    formikProps,
    nombresTickets,
    agregarFormProps,
    db,
    intercambioOpen,
    codigoStr,
    setNombresTickets,
    setDocTicket,
    docIntercambio,
    docTicket,
  } = props;
  const history = useHistory();
  const [ticketNameDisabled, setTicketNameDisabled] = useState(true);
  const { setValues, setErrors } = useFormikContext<PrincipalValues>();
  const [nombreTemporal, setNombreTemporal] = useState<string | null>(null);
  const [idTemporal, setIdTemporal] = useState(-1);
  useEffect(() => {
    if (db) {
      setDocTicket(null);
      obtenerPrincipalValues(
        db,
        history.location.search,
        setValues,
        setErrors,
        setDocTicket,
        docIntercambio
      );
    }
    // if (history.location.search === '' && nombresTickets[0]) {
    //   history.replace(`/${nombresTickets[0]}`);
    // }
  }, [db, history.location.search]);

  const handleChange = (_e: any, newValue: string) => {
    // @ts-expect-error:err
    document.activeElement?.blur();
    history.replace(`/${newValue}`);
  };

  const handleTicketNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    i: number
  ) => {
    if (e.target.value.length <= 15) {
      setIdTemporal(i);
      setNombreTemporal(e.target.value);
    }
  };

  return (
    <>
      <CssBaseline />
      <AppBar color="default" position="static">
        <Tabs
          indicatorColor="primary"
          onChange={(event, value) => handleChange(event, value)}
          scrollButtons="auto"
          textColor="primary"
          value={history.location.search}
          variant="scrollable"
        >
          {nombresTickets.map((val, i) => (
            <Tab
              disableRipple
              label={
                <Box
                  component="div"
                  onDoubleClick={() => setTicketNameDisabled(false)}
                  overflow="visible"
                >
                  <InputBase
                    disabled={ticketNameDisabled}
                    onBlur={async () => {
                      setTicketNameDisabled(true);
                      const nuevosTickets = nombresTickets.map((v, j) => {
                        if (j === i) {
                          return { _id: v._id, nombre: nombreTemporal };
                        }
                        return v;
                      });
                      setNombresTickets(nuevosTickets);
                      await docTicket?.update({
                        $set: { nombre: nombreTemporal },
                      });
                      setIdTemporal(-1);
                      setNombreTemporal(null);
                    }}
                    onChange={(e) => handleTicketNameChange(e, i)}
                    value={
                      nombreTemporal && i === idTemporal
                        ? nombreTemporal
                        : val.nombre
                        ? val.nombre
                        : decodeURI(val._id.substring(1))
                    }
                  />
                </Box>
              }
              value={val._id}
            />
          ))}
        </Tabs>
      </AppBar>
      <Box overflow="visible" p={1}>
        <form onSubmit={formikProps.handleSubmit}>
          {/* <h6>{JSON.stringify(values)}</h6> */}
          <ArticulosEscaner
            abrirPaquetes
            agregarFormProps={agregarFormProps}
            codigoStr={codigoStr}
            doc={docTicket || undefined}
            esIntercambio={false}
            incluirPrecio
            intercambioOpen={intercambioOpen}
            productos={opcionesArticulos}
            setCodigoStr={setCodigoStr}
            setTotal={setTotal}
          />
        </form>
      </Box>
    </>
  );
};

export default Tickets;
