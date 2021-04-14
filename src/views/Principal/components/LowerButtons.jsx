/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { GlobalHotKeys } from 'react-hotkeys';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/Person';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import PrintIcon from '@material-ui/icons/Print';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import Tooltip from '@material-ui/core/Tooltip';
import { useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

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
    total,
    setEliminarTicketConfirmation,
    setAsignarOpen,
    setCobrarOpen,
    formikProps,
  } = props;
  const session = useSelector((state) => state.session);

  const handleAgregarClick = () => {};
  const handleEliminarClick = () => {
    if (session.tickets.length !== 1) {
      setEliminarTicketConfirmation(true);
    }
  };

  const handleAsignarClick = () => {
    setAsignarOpen(true);
  };

  const handleCobrarClick = async() => {
    if (formikProps.values.articulos.length !== 0) {
      await formikProps.validateForm().then(async (validation) => {
        await formikProps.setTouched(validation);
      });
      if (formikProps.errors.articulos ==null) {
        setCobrarOpen(true);
      }
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
          <Tooltip title="CTRL+DEL">
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
        <Box flexGrow={1} p={1}>
          {formikProps.values.cliente === '' ? (
            <Tooltip title="ALT+C">
              <Button
                color="primary"
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
        <Box p={1}>
          <Tooltip title="CTRL+R">
            <Button
              color="primary"
              onClick={handleAgregarClick}
              startIcon={<PrintIcon />}
              variant="outlined"
            >
              Reimprimir último ticket
            </Button>
          </Tooltip>
        </Box>
        <Box p={1}>
          <Tooltip title="SHIFT+C">
            <Button
              color="primary"
              disabled={formikProps.values.articulos.length === 0}
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
