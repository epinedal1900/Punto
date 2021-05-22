import React from 'react';
import Box from '@material-ui/core/Box';
import { GlobalHotKeys } from 'react-hotkeys';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import ReceiptIcon from '@material-ui/icons/Receipt';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useSelector, useDispatch } from 'react-redux';
import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import PrintIcon from '@material-ui/icons/Print';
import { assign } from 'lodash';
import { FormikProps } from 'formik';
import { modificarTickets } from '../../../actions';
import {
  ArticuloForm,
  PrincipalValues,
  Session,
  Ticket,
} from '../../../types/types';
import { RootState } from '../../../types/store';

interface UpperButtonsProps {
  setAgregarOpen: (a: boolean) => void;
  setSelectedTicket: (a: number) => void;
  selectedTicket: number;
  formikProps: FormikProps<PrincipalValues>;
  dialogOpen: boolean;
  setIntercambioOpen: (a: boolean) => void;
  setGenerarReporteConfirmation: (a: boolean) => void;
  setGastoOpen: (a: boolean) => void;
  setDialogOpen: (a: boolean) => void;
  setRegresoOpen: (a: boolean) => void;
  esMenudeo: boolean;
  setEsMenudeo: (a: boolean) => void;
}
const UpperButtons = (props: UpperButtonsProps): JSX.Element => {
  const {
    setAgregarOpen,
    setSelectedTicket,
    selectedTicket,
    formikProps,
    dialogOpen,
    setIntercambioOpen,
    setGenerarReporteConfirmation,
    setGastoOpen,
    setDialogOpen,
    setRegresoOpen,
    esMenudeo,
    setEsMenudeo,
  } = props;
  const dispatch = useDispatch();
  const session: Session = useSelector((state: RootState) => state.session);

  const handleAgregarClick = () => {
    if (!dialogOpen) {
      setDialogOpen(true);
      setAgregarOpen(true);
    }
  };
  const handleIntercambioClick = () => {
    if (!dialogOpen && session.puntoIdActivo) {
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
  const handleGenerarReporteClick = () => {
    if (!dialogOpen) {
      setDialogOpen(true);
      setGenerarReporteConfirmation(true);
    }
  };
  const handleGastoClick = () => {
    if (!dialogOpen && session.puntoIdActivo) {
      setDialogOpen(true);
      setGastoOpen(true);
    }
  };

  const handleNuevoTicketClick = () => {
    if (dialogOpen === false) {
      const nuevosTickets: Ticket[] = JSON.parse(
        JSON.stringify(session.tickets)
      );
      if (nuevosTickets.length < 7) {
        nuevosTickets[selectedTicket] = {
          cliente: formikProps.values.cliente || '',
          articulos: formikProps.values.articulos,
          esMenudeo,
          nombre: nuevosTickets[selectedTicket].nombre,
        };
        nuevosTickets.push({
          cliente: '',
          articulos: [],
          nombre: `ticket ${nuevosTickets.length+1}`,
        });
        dispatch(
          modificarTickets({
            tickets: nuevosTickets,
          })
        );
        setEsMenudeo(false);
        formikProps.setFieldValue('articulos', []);
        formikProps.setFieldValue('cliente', '');
        setSelectedTicket(nuevosTickets.length - 1);
      }
    }
  };

  const handleTicketChange = (n: number) => {
    const nuevosTickets: Ticket[] = JSON.parse(JSON.stringify(session.tickets));
    if (n <= nuevosTickets.length) {
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
      setEsMenudeo(Boolean(nuevosTickets[n - 1].esMenudeo));
      formikProps.setFieldValue('articulos', nuevosTickets[n - 1].articulos);
      formikProps.setFieldValue('cliente', nuevosTickets[n - 1].cliente);
      setSelectedTicket(n - 1);
    }
  };
  const handleMenudeoClick = () => {
    let aumento: number;
    const nuevosTickets: Ticket[] = JSON.parse(JSON.stringify(session.tickets));
    if (esMenudeo) {
      aumento = 0;
      nuevosTickets[selectedTicket].esMenudeo = false;
      setEsMenudeo(false);
    } else {
      aumento = 15;
      setEsMenudeo(true);
      nuevosTickets[selectedTicket].esMenudeo = true;
    }
    let articulos: ArticuloForm[] = JSON.parse(
      JSON.stringify(formikProps.values.articulos)
    );
    articulos = articulos.map((val) => {
      assign(val, { precio: val.articulo.precio + aumento });
      return val;
    });
    formikProps.setFieldValue('articulos', articulos, false);
    dispatch(
      modificarTickets({
        tickets: nuevosTickets,
      })
    );
  };

  const keyMap = {
    MEDUEO: 'ctrl+m',
    MEDUEOM: 'ctrl+M',
    AGREGAR: 'ctrl+n',
    AGREGARM: 'ctrl+N',
    AGREGARI: 'ins',
    INTERCAMBIO: 'ctrl+i',
    INTERCAMBIOM: 'ctrl+I',
    GASTO: 'ctrl+g',
    GASTOM: 'ctrl+G',
    NUEVO_TICKET: 'ctrl+shift+n',
    NUEVO_TICKETM: 'ctrl+shift+N',
    TICKET1: 'ctrl+1',
    TICKET2: 'ctrl+2',
    TICKET3: 'ctrl+3',
    TICKET4: 'ctrl+4',
    TICKET5: 'ctrl+5',
    TICKET6: 'ctrl+6',
    TICKET7: 'ctrl+7',
  };

  const handlers = {
    MEDUEO: handleMenudeoClick,
    MEDUEOM: handleMenudeoClick,
    AGREGAR: handleAgregarClick,
    AGREGARM: handleAgregarClick,
    AGREGARI: handleAgregarClick,
    INTERCAMBIO: handleIntercambioClick,
    INTERCAMBIOM: handleIntercambioClick,
    GASTO: handleGastoClick,
    GASTOM: handleGastoClick,
    NUEVO_TICKET: handleNuevoTicketClick,
    NUEVO_TICKETM: handleNuevoTicketClick,
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
        <Box p={1}>
          <Tooltip title={<h3>CTRL+N</h3>}>
            <Button
              color="primary"
              disabled={formikProps.values.articulos.length >= 20}
              onClick={handleAgregarClick}
              startIcon={<AddIcon />}
              variant="outlined"
            >
              Agregar prendas
            </Button>
          </Tooltip>
        </Box>
        <Box flexGrow={1} p={1}>
          <Tooltip title={<h3>CTRL+M</h3>}>
            <FormControlLabel
              control={
                <Switch
                  checked={esMenudeo}
                  color="primary"
                  name="switch"
                  onChange={handleMenudeoClick}
                  value={esMenudeo}
                />
              }
              label="menudeo"
              labelPlacement={session.sinAlmacen ? 'end' : 'bottom'}
            />
          </Tooltip>
        </Box>
        <Box p={1}>
          <Button
            color="secondary"
            disabled={session.puntoIdActivo == null || !session.online}
            onClick={handleGenerarReporteClick}
            startIcon={<PrintIcon />}
            variant="outlined"
          >
            Generar reporte
          </Button>
        </Box>
        {!session.sinAlmacen && (
          <Box p={1}>
            <Button
              color="primary"
              disabled={session.puntoIdActivo == null}
              onClick={handleRegresoClick}
              startIcon={<SettingsBackupRestoreIcon />}
              variant="outlined"
            >
              Nuevo regreso
            </Button>
          </Box>
        )}
        <Box p={1}>
          <Tooltip title={<h3>CTRL+G</h3>}>
            <Button
              color="primary"
              disabled={session.puntoIdActivo == null}
              onClick={handleGastoClick}
              startIcon={<MonetizationOnOutlinedIcon />}
              variant="outlined"
            >
              Nuevo gasto
            </Button>
          </Tooltip>
        </Box>
        {(session.nombre === 'Pasillo 2' || session.nombre === 'Pasillo 6') && (
          <Box p={1}>
            <Tooltip title={<h3>CTRL+I</h3>}>
              <Button
                color="primary"
                disabled={session.puntoIdActivo == null}
                onClick={handleIntercambioClick}
                startIcon={<SwapHorizIcon />}
                variant="outlined"
              >
                Nuevo intercambio
              </Button>
            </Tooltip>
          </Box>
        )}
        <Box p={1}>
          <Tooltip title={<h3>CTRL+SHIFT+N</h3>}>
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
};

export default UpperButtons;
