/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
/* eslint-disable react/no-multi-comp */
/* eslint-disable import/no-cycle */
import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Grid } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { RxDatabase, RxDocument } from 'rxdb';
import { FormikHelpers, FormikProps, useFormikContext } from 'formik';
import { useHistory } from 'react-router';
import { NombreTickets, PrincipalValues, SetState } from '../../../types/types';
import ArticulosEscaner from '../../../formPartials/ArticulosEscaner';
import FormDialog from '../../../formPartials/FormDialog';
import TextFieldFormik from '../../../formPartials/TextFieldFormik';
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
  dialogOpen: boolean;
  setDialogOpen: SetState<boolean>;
}
interface NuevoNombreTicket {
  nombre: string;
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
    dialogOpen,
    setDialogOpen,
  } = props;
  const history = useHistory();
  const { setValues, setErrors } = useFormikContext<PrincipalValues>();
  const [idNuevoNombre, setidNuevoNombre] = useState(-1);
  const [nuevoNombreTicketOpen, setNuevoNombreTicketOpen] = useState(false);
  const [nuevoTicketSubmitLoading, setNuevoTicketSubmitLoading] = useState(
    false
  );
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

  const handleTicketNameChange = async (
    values: NuevoNombreTicket,
    actions: FormikHelpers<NuevoNombreTicket>
  ) => {
    setNuevoTicketSubmitLoading(true);
    const nuevosTickets = nombresTickets.map((v, j) => {
      if (j === idNuevoNombre) {
        return { _id: v._id, nombre: values.nombre };
      }
      return v;
    });
    await docTicket
      ?.update({
        $set: { nombre: values.nombre },
      })
      .then(() => {
        setNombresTickets(nuevosTickets);
        actions.resetForm();
        setNuevoTicketSubmitLoading(false);
        setDialogOpen(false);
        setNuevoNombreTicketOpen(false);
      });
  };

  return (
    <>
      <CssBaseline />
      <FormDialog<NuevoNombreTicket>
        handleClose={() => {
          setDialogOpen(false);
        }}
        handleSubmit={handleTicketNameChange}
        initialValues={{
          nombre:
            nombresTickets[idNuevoNombre]?.nombre ||
            decodeURI(nombresTickets[idNuevoNombre]?._id.substring(1) || ''),
        }}
        loading={nuevoTicketSubmitLoading}
        maxWidth="xs"
        open={nuevoNombreTicketOpen}
        render={() => (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextFieldFormik
                  label={
                    nombresTickets[idNuevoNombre]?.nombre ||
                    decodeURI(
                      nombresTickets[idNuevoNombre]?._id.substring(1) ||
                        'Nombre'
                    )
                  }
                  maxLength={15}
                  valueName="nombre"
                />
              </Grid>
            </Grid>
          </>
        )}
        setOpen={setNuevoNombreTicketOpen}
        submitText="Editar"
        title="Nuevo nombre de ticket"
        validationSchema={yup.object()}
      />
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
              label={val.nombre ? val.nombre : decodeURI(val._id.substring(1))}
              onDoubleClick={() => {
                if (!dialogOpen) {
                  setNuevoNombreTicketOpen(true);
                  setDialogOpen(true);
                  setidNuevoNombre(i);
                }
              }}
              value={val._id}
            />
          ))}
        </Tabs>
      </AppBar>
      <Box overflow="visible" p={1}>
        <form onSubmit={formikProps.handleSubmit}>
          {/* <h6>{JSON.stringify(values)}</h6> */}
          <ArticulosEscaner
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
