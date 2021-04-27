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
import { modificarTickets } from '../../../actions';

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
  } = props;
  const session = useSelector((state) => state.session);
  const dispatch = useDispatch();

  const handleChange = (event, newValue) => {
    const nuevosTickets = JSON.parse(JSON.stringify(session.tickets));
    nuevosTickets[selectedTicket] = {
      cliente: formikProps.values.cliente || '',
      articulos: formikProps.values.articulos,
    };
    dispatch(
      modificarTickets({
        tickets: nuevosTickets,
      })
    );
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
        <Box height={475} maxHeight={475} overflow="auto" p={3}>
          <form onSubmit={formikProps.handleSubmit}>
            <Articulos
              agregarButton={false}
              agregarOpen={agregarOpen}
              allowNoItems
              handleAgregarClose={handleAgregarClose}
              opcionesArticulos={opcionesArticulos}
              setAgregarOpen={setAgregarOpen}
              setDialogOpen={setDialogOpen}
              setTotal={setTotal}
            />
            {/* <h2>{JSON.stringify(formikProps.errors)}</h2>
            <h2>{JSON.stringify(session)}</h2> */}
          </form>
        </Box>
        <Divider />
      </div>
    </div>
  );
};

export default Tickets;
