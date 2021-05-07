/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { GlobalHotKeys } from 'react-hotkeys';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/Person';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import Tooltip from '@material-ui/core/Tooltip';
import ReceiptIcon from '@material-ui/icons/Receipt';
import { useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import crearTicketData from '../../../utils/crearTicketData';

const { remote } = window.require('electron');
const { PosPrinter } = remote.require('electron-pos-printer');

export default function UpperButtons(props) {
  const {
    total,
    setEliminarTicketConfirmation,
    setAsignarOpen,
    setCobrarOpen,
    formikProps,
    dialogOpen,
    setDialogOpen,
    setPagoOpen,
  } = props;

  const session = useSelector((state) => state.session);
  const [reimprimirDisabled, setReimprimirDisabled] = useState(null);

  const handleReimprimirClick = async () => {
    setReimprimirDisabled(true);
    const data = crearTicketData(
      session.ultimoTicket.infoPunto,
      session.ultimoTicket.articulos,
      session.ultimoTicket.cliente,
      session.ultimoTicket.cantidadPagada,
      session.ultimoTicket.cambio
    );
    const options = {
      preview: false,
      width: session.ancho,
      margin: '0 0 0 0',
      copies: 1,
      printerName: session.impresora,
      timeOutPerLine: 400,
      silent: true,
    };
    if (session.ancho && session.impresora) {
      PosPrinter.print(data, options)
        .then(() => {})
        .catch((error) => {
          // eslint-disable-next-line no-alert
          alert(error);
        });
    } else {
      // eslint-disable-next-line no-alert
      alert('seleccione una impresora y un ancho');
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setReimprimirDisabled(false);
  };
  const handleEliminarClick = () => {
    if (!dialogOpen && session.tickets.length !== 1) {
      setEliminarTicketConfirmation(true);
      setDialogOpen(true);
    }
  };

  const handleAsignarClick = () => {
    if (!dialogOpen && session.puntoIdActivo) {
      setAsignarOpen(true);
      setDialogOpen(true);
    }
  };
  const handlePagoClick = () => {
    if (!dialogOpen && session.puntoIdActivo) {
      setDialogOpen(true);
      setPagoOpen(true);
    }
  };

  const handleCobrarClick = async () => {
    if (formikProps.values.articulos.length !== 0) {
      await formikProps.validateForm().then(async (validation) => {
        await formikProps.setTouched(validation);
        if (
          validation.articulos == null &&
          !dialogOpen &&
          session.puntoIdActivo
        ) {
          setCobrarOpen(true);
          setDialogOpen(true);
        }
      });
    }
  };

  const keyMap = {
    ELIMINAR_TICKET: 'ctrl+del',
    ASIGNAR_CLICK: 'alt+c',
    COBRAR_CLICK: 'shift+c',
  };

  const handlers = {
    ELIMINAR_TICKET: handleEliminarClick,
    ASIGNAR_CLICK: handleAsignarClick,
    COBRAR_CLICK: handleCobrarClick,
  };

  return (
    <GlobalHotKeys allowChanges handlers={handlers} keyMap={keyMap}>
      <Box display="flex" m={0} p={1} width="100%">
        <Box p={1}>
          <Tooltip title={<h3>CTRL+DEL</h3>}>
            <Button
              color="secondary"
              disabled={session.tickets.length === 1}
              onClick={handleEliminarClick}
              startIcon={<DeleteForeverIcon />}
              variant="outlined"
            >
              Eliminar ticket
            </Button>
          </Tooltip>
        </Box>
        <Box p={1}>
          {formikProps.values.cliente === '' ? (
            <Tooltip title={<h3>ALT+C</h3>}>
              <Button
                color="primary"
                disabled={session.puntoIdActivo == null}
                onClick={handleAsignarClick}
                startIcon={<PersonIcon />}
                variant="outlined"
              >
                Asignar Cliente
              </Button>
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
                onClick={() => formikProps.setFieldValue('cliente', '', false)}
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
            disabled={session.puntoIdActivo == null}
            onClick={handlePagoClick}
            startIcon={<AccountBalanceWalletIcon />}
            variant="outlined"
          >
            Nuevo pago
          </Button>
        </Box>
        <Box p={1}>
          <Tooltip title={<h3>CTRL+R</h3>}>
            <Button
              color="primary"
              disabled={isEmpty(session.ultimoTicket) || reimprimirDisabled}
              onClick={handleReimprimirClick}
              startIcon={<ReceiptIcon />}
              variant="outlined"
            >
              Reimprimir último ticket
            </Button>
          </Tooltip>
        </Box>
        <Box p={1}>
          <Tooltip title={<h3>SHIFT+C</h3>}>
            <Button
              color="primary"
              disabled={
                formikProps.values.articulos.length === 0 ||
                session.puntoIdActivo == null
              }
              onClick={handleCobrarClick}
              startIcon={<AttachMoneyIcon />}
              variant="contained"
            >
              Cobrar
            </Button>
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
}
