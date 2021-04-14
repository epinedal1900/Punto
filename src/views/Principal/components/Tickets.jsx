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
import Articulos from '../../../formPartials/Articulos';
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
  } = props;
  const session = useSelector((state) => state.session);
  const dispatch = useDispatch();

  const handleChange = (event, newValue) => {
    const nuevosTickets = JSON.parse(JSON.stringify(session.tickets));
    nuevosTickets[selectedTicket] = formikProps.values.articulos;
    dispatch(
      modificarTickets({
        tickets: nuevosTickets,
      })
    );
    formikProps.setFieldValue('articulos', nuevosTickets[newValue]);
    setSelectedTicket(newValue);
  };
  const handleAgregarClose = () => {
    setAgregarOpen(false);
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
        <Box height={425} maxHeight={425} overflow="auto" p={3}>
          <form onSubmit={formikProps.handleSubmit}>
            <Articulos
              agregarButton={false}
              agregarOpen={agregarOpen}
              allowNoItems
              handleAgregarClose={handleAgregarClose}
              opcionesArticulos={opcionesArticulos}
              setAgregarOpen={setAgregarOpen}
              setTotal={setTotal}
            />
            <h2>{JSON.stringify(formikProps.values)}</h2>
            <h2>{JSON.stringify(formikProps.errors)}</h2>
            <h2>{JSON.stringify(session)}</h2>
          </form>
        </Box>
        <Divider />
      </div>
    </div>
  );
};

export default Tickets;
