/* eslint-disable react/jsx-key */
/* eslint-disable react/no-multi-comp */
import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import { useSelector, useDispatch } from 'react-redux';
import Articulos from './Articulos';
// import useMediaQuery from '@material-ui/core/useMediaQuery';
import { modificarTickets } from '../../../actions';

const { ipcRenderer } = window.require('electron');

const Tickets = (props) => {
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
  const session = useSelector((state) => state.session);
  const dispatch = useDispatch();
  const store = ipcRenderer.sendSync('STORE');
  // const matches = useMediaQuery('(min-height:600px)');
  const height = window.innerHeight;

  const handleChange = (event, newValue) => {
    const nuevosTickets = JSON.parse(JSON.stringify(session.tickets));
    nuevosTickets[selectedTicket] = {
      cliente: formikProps.values.cliente || '',
      articulos: formikProps.values.articulos,
      esMenudeo,
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
              <Tab label={`ticket ${i + 1}`} />
            ))}
          </Tabs>
        </AppBar>
        <Box height={height * 0.54} maxHeight={425} overflow="auto" p={3}>
          <form onSubmit={formikProps.handleSubmit}>
            <Articulos
              agregarButton={false}
              agregarOpen={agregarOpen}
              allowNoItems
              handleAgregarClose={handleAgregarClose}
              opcionesArticulos={opcionesArticulos}
              selectedTicket={selectedTicket}
              setAgregarOpen={setAgregarOpen}
              setDialogOpen={setDialogOpen}
              setTotal={setTotal}
            />
            {/* <h2>{JSON.stringify(formikProps.errors)}</h2>
            <h2>{JSON.stringify(session)}</h2>
            <h2>{JSON.stringify(formikProps.values)}</h2> */}
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
