import React from 'react';
import Box from '@material-ui/core/Box';
import { GlobalHotKeys } from 'react-hotkeys';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import ReceiptIcon from '@material-ui/icons/Receipt';
import { useSelector, useDispatch } from 'react-redux';
import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import PrintIcon from '@material-ui/icons/Print';
import { modificarTickets } from '../../../actions';

export default function UpperButtons(props) {
  const {
    setAgregarOpen,
    setSelectedTicket,
    selectedTicket,
    formikProps,
    dialogOpen,
    setIntercambioOpen,
    setImprimirReporteConfirmation,
    setGastoOpen,
    setDialogOpen,
    setRegresoOpen,
  } = props;
  const dispatch = useDispatch();
  const session = useSelector((state) => state.session);

  const handleAgregarClick = () => {
    if (!dialogOpen) {
      setDialogOpen(true);
      setAgregarOpen(true);
    }
  };
  const handleIntercambioClick = () => {
    if (!dialogOpen) {
      setDialogOpen(true);
      setIntercambioOpen(true);
    }
  };
  const handleRegresoClick = () => {
    if (!dialogOpen) {
      setDialogOpen(true);
      setRegresoOpen(true);
    }
  };
  const handleImprimirReporteClick = () => {
    if (!dialogOpen) {
      setDialogOpen(true);
      setImprimirReporteConfirmation(true);
    }
  };
  const handleGastoClick = () => {
    if (!dialogOpen) {
      setDialogOpen(true);
      setGastoOpen(true);
    }
  };

  const handleNuevoTicketClick = () => {
    if (dialogOpen === false) {
      const nuevosTickets = JSON.parse(JSON.stringify(session.tickets));
      if (nuevosTickets.length < 7) {
        nuevosTickets[selectedTicket] = {
          cliente: formikProps.cliente || '',
          articulos: formikProps.values.articulos,
        };
        nuevosTickets.push({ cliente: '', articulos: [] });
        dispatch(
          modificarTickets({
            tickets: nuevosTickets,
          })
        );
        formikProps.setFieldValue('articulos', []);
        formikProps.setFieldValue('cliente', '');
        setSelectedTicket(nuevosTickets.length - 1);
      }
    }
  };

  const handleTicketChange = (n) => {
    const nuevosTickets = JSON.parse(JSON.stringify(session.tickets));
    if (n <= nuevosTickets.length) {
      nuevosTickets[selectedTicket] = {
        cliente: formikProps.values.cliente || '',
        articulos: formikProps.values.articulos,
      };
      dispatch(
        modificarTickets({
          tickets: nuevosTickets,
        })
      );
      formikProps.setFieldValue('articulos', nuevosTickets[n - 1].articulos);
      formikProps.setFieldValue('cliente', nuevosTickets[n - 1].cliente);
      setSelectedTicket(n - 1);
    }
  };

  const keyMap = {
    AGREGAR: 'ctrl+n',
    INTERCAMBIO: 'ctrl+i',
    GASTO: 'ctrl+g',
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
    INTERCAMBIO: handleIntercambioClick,
    GASTO: handleGastoClick,
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
          <Button
            color="secondary"
            onClick={handleImprimirReporteClick}
            startIcon={<PrintIcon />}
            variant="outlined"
          >
            Imprimir reporte
          </Button>
        </Box>
        <Box p={1}>
          <Button
            color="primary"
            onClick={handleRegresoClick}
            startIcon={<SettingsBackupRestoreIcon />}
            variant="outlined"
          >
            Nuevo regreso
          </Button>
        </Box>
        <Box p={1}>
          <Tooltip title="CTRL+G">
            <Button
              color="primary"
              onClick={handleGastoClick}
              startIcon={<MonetizationOnOutlinedIcon />}
              variant="outlined"
            >
              Nuevo gasto
            </Button>
          </Tooltip>
        </Box>
        <Box p={1}>
          <Tooltip title="CTRL+I">
            <Button
              color="primary"
              onClick={handleIntercambioClick}
              startIcon={<SwapHorizIcon />}
              variant="outlined"
            >
              Nuevo intercambio
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
