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
import Divider from '@material-ui/core/Divider';
import { useSelector, useDispatch } from 'react-redux';
import { FormikProps } from 'formik';
import { Typography } from '@material-ui/core';
import { RootState } from '../../../types/store';
import {
  ArticuloOption,
  PrincipalValues,
  Session,
  Ticket,
} from '../../../types/types';
import { modificarTickets } from '../../../actions';
import Articulos from './Articulos';

// const { ipcRenderer } = window.require('electron');

interface TicketsProps {
  agregarOpen: boolean;
  setAgregarOpen: (a: boolean) => void;
  setTotal: (a: number) => void;
  opcionesArticulos: ArticuloOption[];
  selectedTicket: number;
  setSelectedTicket: (a: number) => void;
  formikProps: FormikProps<PrincipalValues>;
  setDialogOpen: (a: boolean) => void;
  esMenudeo: boolean;
  setEsMenudeo: (a: boolean) => void;
}
const Tickets = (props: TicketsProps): JSX.Element => {
  const {
    agregarOpen,
    setAgregarOpen,
    setTotal,
    opcionesArticulos,
    selectedTicket,
    setSelectedTicket,
    formikProps,
    setDialogOpen,
    esMenudeo,
    setEsMenudeo,
  } = props;
  const [ticketNameDisabled, setTicketNameDisabled] = useState(true);
  const session: Session = useSelector((state: RootState) => state.session);
  const dispatch = useDispatch();
  // const store = ipcRenderer.sendSync('STORE');
  const height = window.innerHeight;

  useEffect(() => {
    return () => {
      dispatch(
        modificarTickets({
          tickets: [{ cliente: '', articulos: [], nombre: 'ticket 1' }],
        })
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (_e: any, newValue: number) => {
    const nuevosTickets: Ticket[] = JSON.parse(JSON.stringify(session.tickets));
    nuevosTickets[selectedTicket] = {
      cliente: formikProps.values.cliente || '',
      articulos: formikProps.values.articulos,
      esMenudeo,
      nombre: nuevosTickets[selectedTicket].nombre,
    };
    dispatch(
      modificarTickets({
        tickets: nuevosTickets,
      })
    );
    setEsMenudeo(Boolean(nuevosTickets[newValue].esMenudeo));
    formikProps.setFieldValue('articulos', nuevosTickets[newValue].articulos);
    formikProps.setFieldValue('cliente', nuevosTickets[newValue].cliente);
    setSelectedTicket(newValue);
  };
  const handleAgregarClose = () => {
    setAgregarOpen(false);
    setDialogOpen(false);
  };
  const handleTicketNameChange = (e: any, i: number) => {
    if (e.target.value.length <= 15) {
      const nuevosTickets: Ticket[] = JSON.parse(
        JSON.stringify(session.tickets)
      );
      nuevosTickets[i] = {
        cliente: nuevosTickets[i].cliente,
        articulos: nuevosTickets[i].articulos,
        esMenudeo: Boolean(nuevosTickets[i].esMenudeo),
        nombre: e.target.value,
      };
      dispatch(
        modificarTickets({
          tickets: nuevosTickets,
        })
      );
    }
  };

  return (
    <div>
      <CssBaseline />
      <div>
        <AppBar color="default" position="static">
          <Tabs
            indicatorColor="primary"
            onChange={(event, value) => handleChange(event, value)}
            scrollButtons="auto"
            textColor="primary"
            value={selectedTicket}
            variant="scrollable"
          >
            {session.tickets.map((ticket, i) => (
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
                      onBlur={() => setTicketNameDisabled(true)}
                      onChange={(e) => handleTicketNameChange(e, i)}
                      value={ticket.nombre}
                    />
                  </Box>
                }
              />
            ))}
          </Tabs>
        </AppBar>
        <Box height={height * 0.54} maxHeight={425} overflow="auto" p={3}>
          <form onSubmit={formikProps.handleSubmit}>
            {typeof formikProps.errors.articulos === 'string' && (
              <Typography color="error" variant="h6">
                {formikProps.errors.articulos}
              </Typography>
            )}
            <Articulos
              addButton={false}
              agregarOpen={agregarOpen}
              handleAgregarClose={handleAgregarClose}
              opcionesArticulos={opcionesArticulos}
              selectedTicket={selectedTicket}
              setAgregarOpen={setAgregarOpen}
              setDialogOpen={setDialogOpen}
              setTotal={setTotal}
            />
            {/* <h2>{JSON.stringify(formikProps.errors)}</h2> */}
            {/* <h2>{JSON.stringify(session.tickets)}</h2>
            <h2>{JSON.stringify(formikProps.values.articulos)}</h2> */}
            {/* <h2>{JSON.stringify(store.ventas)}</h2>
            <h2>{JSON.stringify(store.gastos)}</h2>
            <h2>{JSON.stringify(store.regresos)}</h2>
            <h2>{JSON.stringify(store.intercambios)}</h2>
            <h2>{JSON.stringify(store.ventasClientes)}</h2>
            <h2>{JSON.stringify(store.pagosClientes)}</h2>
            <h2>{JSON.stringify(store.movimientosOffline)}</h2> */}
          </form>
        </Box>
        <Divider />
      </div>
    </div>
  );
};

export default Tickets;
