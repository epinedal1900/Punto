import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { GlobalHotKeys } from 'react-hotkeys';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import ReceiptIcon from '@material-ui/icons/Receipt';
import { useSelector, useDispatch } from 'react-redux';
import { modificarTickets } from '../../../actions';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
}));

export default function UpperButtons(props) {
  const {
    setAgregarOpen,
    setSelectedTicket,
    selectedTicket,
    formikProps,
  } = props;
  const dispatch = useDispatch();
  const session = useSelector((state) => state.session);

  const handleAgregarClick = () => {
    setAgregarOpen(true);
  };

  const handleNuevoTicketClick = () => {
    const nuevosTickets = JSON.parse(JSON.stringify(session.tickets));
    if (nuevosTickets.length < 7) {
      nuevosTickets[selectedTicket] = formikProps.values.articulos;
      nuevosTickets.push([]);
      dispatch(
        modificarTickets({
          tickets: nuevosTickets,
        })
      );
      formikProps.setFieldValue('articulos', []);
      setSelectedTicket(nuevosTickets.length - 1);
    }
  };

  const handleTicketChange = (n) => {
    const nuevosTickets = JSON.parse(JSON.stringify(session.tickets));
    if (n <= nuevosTickets.length) {
      nuevosTickets[selectedTicket] = formikProps.values.articulos;
      dispatch(
        modificarTickets({
          tickets: nuevosTickets,
        })
      );
      formikProps.setFieldValue('articulos', nuevosTickets[n - 1]);
      setSelectedTicket(n - 1);
    }
  };

  const keyMap = {
    AGREGAR: 'ctrl+n',
    NUEVO_TICKET: 'ctrl+shift+n',
    TICKET1: 'ctrl+1',
    TICKET2: 'ctrl+2',
    TICKET3: 'ctrl+3',
    TICKET4: 'ctrl+4',
    TICKET5: 'ctrl+5',
    TICKET6: 'ctrl+6',
    TICKET7: 'ctrl+7',
  };

  const handlers = {
    AGREGAR: handleAgregarClick,
    NUEVO_TICKET: handleNuevoTicketClick,
    TICKET1: () => handleTicketChange(1),
    TICKET2: () => handleTicketChange(2),
    TICKET3: () => handleTicketChange(3),
    TICKET4: () => handleTicketChange(4),
    TICKET5: () => handleTicketChange(5),
    TICKET6: () => handleTicketChange(6),
    TICKET7: () => handleTicketChange(7),
  };

  return (
    <GlobalHotKeys allowChanges handlers={handlers} keyMap={keyMap}>
      <Box display="flex" m={0} p={1} width="100%">
        <Box flexGrow={1} p={1}>
          <Tooltip title="CTRL+N">
            <Button
              color="primary"
              disabled={formikProps.values.articulos.length >= 20}
              onClick={handleAgregarClick}
              startIcon={<AddIcon />}
              variant="outlined"
            >
              Agregar
            </Button>
          </Tooltip>
        </Box>
        <Box p={1}>
          <Tooltip title="CTRL+SHIT+N">
            <Button
              color="primary"
              disabled={session.tickets.length >= 7}
              onClick={handleNuevoTicketClick}
              startIcon={<ReceiptIcon />}
              variant="outlined"
            >
              Nuevo ticket
            </Button>
          </Tooltip>
        </Box>
      </Box>
    </GlobalHotKeys>
  );
}
