import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import PersonIcon from '@material-ui/icons/Person';
import ReceiptIcon from '@material-ui/icons/Receipt';
import { FormikProps } from 'formik';
import isEmpty from 'lodash/isEmpty';
import React, { useState } from 'react';
import { GlobalHotKeys } from 'react-hotkeys';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { RxDocument } from 'rxdb';
import { TicketDb } from '../../../Database';
import { RootState } from '../../../types/store';
import { NombreTickets, PrincipalValues, SetState } from '../../../types/types';
import { crearTicketData } from '../../../utils/functions';

const { ipcRenderer } = window.require('electron');

interface UpperButtonsProps {
  total: number;
  setEliminarTicketConfirmation: SetState<boolean>;
  setAsignarOpen: SetState<boolean>;
  setCobrarOpen: SetState<boolean>;
  nombresTickets: NombreTickets[];
  formikProps: FormikProps<PrincipalValues>;
  dialogOpen: boolean;
  setDialogOpen: SetState<boolean>;
  setPagoOpen: SetState<boolean>;
  docTicket: RxDocument<TicketDb> | null;
}
const UpperButtons = (props: UpperButtonsProps): JSX.Element => {
  const {
    total,
    setEliminarTicketConfirmation,
    setAsignarOpen,
    setCobrarOpen,
    formikProps,
    dialogOpen,
    setDialogOpen,
    setPagoOpen,
    docTicket,
    nombresTickets,
  } = props;
  const history = useHistory();
  const plazaState = useSelector((state: RootState) => state.plaza);
  const [reimprimirDisabled, setReimprimirDisabled] = useState(false);
  const handleReimprimirClick = async () => {
    if (plazaState.ultimoTicket) {
      setReimprimirDisabled(true);
      const data = crearTicketData(plazaState.ultimoTicket);
      if (plazaState.ancho && plazaState.impresora) {
        ipcRenderer.send('PRINT', {
          data,
          impresora: plazaState.impresora,
          ancho: plazaState.ancho,
        });
      } else {
        // eslint-disable-next-line no-alert
        alert('seleccione una impresora y un ancho');
      }
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setReimprimirDisabled(false);
    }
  };
  const handleAbrirDialogo = async () => {
    // @ts-expect-error:err
    await document.activeElement?.blur();
    setDialogOpen(true);
  };
  const handleEliminarClick = async () => {
    if (!dialogOpen && nombresTickets.length !== 1) {
      await handleAbrirDialogo();
      setEliminarTicketConfirmation(true);
    }
  };

  const handleAsignarClick = async () => {
    if (!dialogOpen && plazaState._idPunto) {
      await handleAbrirDialogo();
      setAsignarOpen(true);
    }
  };
  const handlePagoClick = async () => {
    if (!dialogOpen && plazaState._idPunto) {
      await handleAbrirDialogo();
      setPagoOpen(true);
    }
  };

  const handleCobrarClick = async () => {
    // @ts-expect-error:err
    await document.activeElement?.blur();
    if (
      formikProps.values.precios.length !== 0 &&
      history.location.search !== ''
    ) {
      await formikProps.validateForm().then(async (validation) => {
        // @ts-expect-error:investigar
        await formikProps.setTouched(validation);
        if (
          !validation.precios &&
          !validation.escaneos &&
          !validation.prendasSueltas &&
          !dialogOpen &&
          plazaState._idPunto
        ) {
          await handleAbrirDialogo();
          setCobrarOpen(true);
        }
      });
    }
  };

  const keyMap = {
    ELIMINAR_TICKET: 'ctrl+del',
    ASIGNAR_CLICK: 'alt+c',
    ASIGNAR_CLICKM: 'alt+C',
    COBRAR_CLICK: 'shift+c',
    COBRAR_CLICKF: 'f12',
    COBRAR_CLICKM: 'shift+C',
  };

  const handlers = {
    ELIMINAR_TICKET: handleEliminarClick,
    ASIGNAR_CLICK: handleAsignarClick,
    ASIGNAR_CLICKF: handleAsignarClick,
    ASIGNAR_CLICKM: handleAsignarClick,
    COBRAR_CLICK: handleCobrarClick,
    COBRAR_CLICKM: handleCobrarClick,
    COBRAR_CLICKF: handleCobrarClick,
  };

  return (
    <GlobalHotKeys allowChanges handlers={handlers} keyMap={keyMap}>
      <Box display="flex" m={0} p={1} width="100%">
        <Box p={1}>
          <Tooltip title={<h3>CTRL+DEL</h3>}>
            <span>
              <Button
                color="secondary"
                disabled={nombresTickets.length === 1}
                onClick={handleEliminarClick}
                startIcon={<DeleteForeverIcon />}
                variant="outlined"
              >
                Eliminar ticket
              </Button>
            </span>
          </Tooltip>
        </Box>
        <Box p={1}>
          {formikProps.values.cliente === '' ? (
            <Tooltip title={<h3>ALT+C</h3>}>
              <span>
                <Button
                  color="primary"
                  disabled={plazaState._idPunto == null}
                  onClick={handleAsignarClick}
                  startIcon={<PersonIcon />}
                  variant="outlined"
                >
                  Asignar Cliente
                </Button>
              </span>
            </Tooltip>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <IconButton
                color="default"
                onClick={async () => {
                  await docTicket?.atomicUpdate((o) => {
                    o.cliente = '';
                    o.tipoDePago = 'efectivo';
                    return o;
                  });
                  formikProps.setFieldValue('cliente', '', false);
                  formikProps.setFieldValue('tipoDePago', 'efectivo', false);
                }}
              >
                <ClearIcon />
              </IconButton>
              <span>
                <Typography variant="h6">
                  {formikProps.values.cliente.nombre}
                </Typography>
              </span>
            </div>
          )}
        </Box>
        <Box flexGrow={1} p={1}>
          <Button
            color="primary"
            disabled={plazaState._idPunto == null}
            onClick={handlePagoClick}
            startIcon={<AccountBalanceWalletIcon />}
            variant="outlined"
          >
            Nuevo pago
          </Button>
        </Box>
        <Box p={1}>
          <Tooltip title={<h3>CTRL+R</h3>}>
            <span>
              <Button
                color="primary"
                disabled={
                  isEmpty(plazaState.ultimoTicket) || reimprimirDisabled
                }
                onClick={handleReimprimirClick}
                startIcon={<ReceiptIcon />}
                variant="outlined"
              >
                Reimprimir último ticket
              </Button>
            </span>
          </Tooltip>
        </Box>
        <Box p={1}>
          <Tooltip
            title={
              <>
                <h3>F12</h3>
                <h3>SHIFT+C</h3>
              </>
            }
          >
            <span>
              <Button
                color="primary"
                disabled={
                  formikProps.values.precios.length === 0 ||
                  plazaState._idPunto == null ||
                  history.location.search === ''
                }
                onClick={handleCobrarClick}
                startIcon={<AttachMoneyIcon />}
                variant="contained"
              >
                Cobrar
              </Button>
            </span>
          </Tooltip>
        </Box>
        <Box alignItems="center" p={1}>
          <Typography variant="h5">
            {`Total: ${Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(total)}`}
          </Typography>
        </Box>
      </Box>
    </GlobalHotKeys>
  );
};

export default UpperButtons;
