/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-loop-func */
import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import { GlobalHotKeys } from 'react-hotkeys';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import ReceiptIcon from '@material-ui/icons/Receipt';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useSelector } from 'react-redux';
import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import PrintIcon from '@material-ui/icons/Print';
import { assign } from 'lodash';
import { useFormikContext } from 'formik';
import { useHistory } from 'react-router';
import { RxDocument } from 'rxdb';

import {
  NombreTickets,
  Precios,
  PrincipalValues,
  SetState,
} from '../../../types/types';
import { RootState } from '../../../types/store';
import { Productos_productos_productos } from '../../../types/apollo';
import { TicketDb } from '../../../Database';

interface UpperButtonsProps {
  setAgregarOpen: SetState<boolean>;
  dialogOpen: boolean;
  setIntercambioOpen: SetState<boolean>;
  setGenerarReporteConfirmation: SetState<boolean>;
  setGastoOpen: SetState<boolean>;
  setDialogOpen: SetState<boolean>;
  productos: Productos_productos_productos[];
  nombresTickets: NombreTickets[];
  setNombresTickets: SetState<NombreTickets[]>;
  docTicket: RxDocument<TicketDb> | null;
}
const UpperButtons = (props: UpperButtonsProps): JSX.Element => {
  const {
    setAgregarOpen,
    dialogOpen,
    nombresTickets,
    setIntercambioOpen,
    setGenerarReporteConfirmation,
    setGastoOpen,
    setDialogOpen,
    setNombresTickets,
    productos,
    docTicket,
  } = props;
  const history = useHistory();
  const plazaState = useSelector((state: RootState) => state.plaza);
  const { setFieldValue, values } = useFormikContext<PrincipalValues>();
  const [esperaNuevoTicket, setEsperaNuevoTicket] = useState(false);
  const handleAgregarClick = () => {
    if (!dialogOpen) {
      setDialogOpen(true);
      setAgregarOpen(true);
    }
  };
  const handleIntercambioClick = () => {
    if (!dialogOpen && plazaState._idPunto) {
      setDialogOpen(true);
      setIntercambioOpen(true);
    }
  };
  const handleGenerarReporteClick = () => {
    if (!dialogOpen) {
      setDialogOpen(true);
      setGenerarReporteConfirmation(true);
    }
  };
  const handleGastoClick = () => {
    if (!dialogOpen && plazaState._idPunto) {
      setDialogOpen(true);
      setGastoOpen(true);
    }
  };

  const handleNuevoTicketClick = async () => {
    if (!dialogOpen && nombresTickets.length < 7) {
      setEsperaNuevoTicket(true);
      let j = nombresTickets.length;
      let _id = encodeURI(`?ticket ${j + 1}`);
      while (
        nombresTickets.findIndex((v) => {
          return v._id === _id;
        }) !== -1
      ) {
        j += 1;
        _id = encodeURI(`?ticket ${j + 1}`);
      }
      const nuevosTickets: NombreTickets[] = JSON.parse(
        JSON.stringify(nombresTickets)
      );
      nuevosTickets.push({ _id, nombre: null });
      setNombresTickets(nuevosTickets);
      history.replace(`/${_id}`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setEsperaNuevoTicket(false);
    }
  };

  const handleTicketChange = (n: number) => {
    // @ts-expect-error:err
    document.activeElement?.blur();
    if (!dialogOpen && n <= nombresTickets.length) {
      history.replace(`/${nombresTickets[n - 1]._id}`);
    }
  };
  const handleMenudeoClick = () => {
    if (docTicket) {
      const aumento = values.esMenudeo ? 0 : 15;
      const precios: Precios[] = values.precios.map((val) => {
        const precioOriginal = productos.find((v) => {
          return v._id === val._id;
        })?.precio;
        const precioFinal = precioOriginal ? precioOriginal + aumento : 0;
        assign(val, { precio: precioFinal });
        return val;
      });

      docTicket.atomicUpdate((o) => {
        o.esMenudeo = !values.esMenudeo;
        o.precios = precios;
        return o;
      });
      setFieldValue('precios', precios, false);
      setFieldValue('esMenudeo', !values.esMenudeo, false);
    }
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
        <Box flexGrow={1} p={1}>
          <Tooltip title={<h3>CTRL+M</h3>}>
            <FormControlLabel
              control={
                <Switch
                  checked={values.esMenudeo}
                  color="primary"
                  disabled={!docTicket}
                  name="switch"
                  onChange={handleMenudeoClick}
                  value={values.esMenudeo}
                />
              }
              label="menudeo"
              labelPlacement="end"
            />
          </Tooltip>
        </Box>
        <Box p={1}>
          <Button
            color="secondary"
            disabled={plazaState._idPunto == null || !plazaState.online}
            onClick={handleGenerarReporteClick}
            startIcon={<PrintIcon />}
            variant="outlined"
          >
            Generar reporte
          </Button>
        </Box>
        <Box p={1}>
          <Tooltip title={<h3>CTRL+G</h3>}>
            <span>
              <Button
                color="primary"
                disabled={plazaState._idPunto == null}
                onClick={handleGastoClick}
                startIcon={<MonetizationOnOutlinedIcon />}
                variant="outlined"
              >
                Nuevo gasto
              </Button>
            </span>
          </Tooltip>
        </Box>
        <Box p={1}>
          <Tooltip title={<h3>CTRL+I</h3>}>
            <span>
              <Button
                color="primary"
                disabled={plazaState._idPunto == null}
                onClick={handleIntercambioClick}
                startIcon={<SwapHorizIcon />}
                variant="outlined"
              >
                Nuevo intercambio
              </Button>
            </span>
          </Tooltip>
        </Box>
        <Box p={1}>
          <Tooltip title={<h3>CTRL+SHIFT+N</h3>}>
            <span>
              <Button
                color="primary"
                disabled={nombresTickets.length >= 7 || esperaNuevoTicket}
                onClick={handleNuevoTicketClick}
                startIcon={<ReceiptIcon />}
                variant="outlined"
              >
                Nuevo ticket
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>
    </GlobalHotKeys>
  );
};

export default UpperButtons;
