/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-destructuring */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { useFormikContext, Field } from 'formik';
import { Divider } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useMutation } from '@apollo/client';
import { RadioGroup } from 'formik-material-ui';
import Radio from '@material-ui/core/Radio';
import { useSelector, useDispatch } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import ObjectId from 'bson-objectid';
import { HotKeys } from 'react-hotkeys';
import dayjs from 'dayjs';
import { pdf } from '@react-pdf/renderer';
import { RxDocument } from 'rxdb';

import Notas from './Notas';
import {
  DatosTablaPrendas,
  ImpresionDeTicketsArgs,
  PrendasRevision,
  PrincipalValues,
  SetState,
} from '../../../types/types';
import { RootState } from '../../../types/store';
import { MoneyFormat } from '../../../utils/TextFieldFormats';
import { PLAZA } from '../../../utils/queries';
import {
  agruparArticulosParaVenta,
  crearTicketData,
  datosParaTablaDePrendas,
  fechaPorId,
  montoPrendasNuevaVenta,
  restablecerTicket,
} from '../../../utils/functions';
import {
  NUEVA_VENTA_CLIENTE,
  NUEVA_VENTA_PUNTO_DE_VENTA,
  NUEVO_PAGO,
} from '../../../utils/mutations';
import {
  nuevaVentaCliente,
  nuevaVentaClienteVariables,
  nuevaVentaPuntoDeVenta,
  nuevaVentaPuntoDeVentaVariables,
  nuevoPagoVariables,
  plaza_plaza_ventas,
  PrendasNuevaVenta,
  TipoDePago,
} from '../../../types/apollo';
import { modificarUltimoTicket } from '../../../actions';
import RevisionDeArticulos from '../../../components/RevisionDeArticulos';
import * as Database from '../../../Database';

const { ipcRenderer } = window.require('electron');
const electron = window.require('electron');
const { remote } = electron;
const { BrowserWindow } = remote;

interface CobrarFormProps {
  open: boolean;
  setCobrarOpen: SetState<boolean>;
  setDialogOpen: SetState<boolean>;
  setMessage: SetState<string | null>;
  setSuccess: SetState<boolean>;
  plazaDoc: RxDocument<Database.plazaDB>;
  docTicket: RxDocument<Database.TicketDb> | null;
  mutationVariablesDoc: RxDocument<Database.mutation_variables>;
}
const CobrarForm = (props: CobrarFormProps): JSX.Element => {
  const {
    open,
    setCobrarOpen,
    docTicket,
    setDialogOpen,
    setMessage,
    setSuccess,
    plazaDoc,
    mutationVariablesDoc,
  } = props;
  const {
    values,
    errors,
    touched,
    setFieldValue,
    resetForm,
  } = useFormikContext<PrincipalValues>();
  const [submitting, setSubmitting] = useState(false);
  const [cambio, setCambio] = useState('$0.00');

  const plazaState = useSelector((state: RootState) => state.plaza);
  const dispatch = useDispatch();
  const [pRevision, setPRevision] = useState<PrendasRevision[] | null>(null);
  const [pPrendas, setPPrendas] = useState<PrendasNuevaVenta[] | null>(null);
  const [total, setTotal] = useState<number>(0);
  useEffect(() => {
    if (open) {
      const { prendas, revision } = agruparArticulosParaVenta(values);
      setPRevision(revision);
      setPPrendas(prendas);
      setTotal(montoPrendasNuevaVenta(prendas));
    }
  }, [open]);

  const [nuevaVentaClienteFunction] = useMutation<
    nuevaVentaCliente,
    nuevaVentaClienteVariables
  >(NUEVA_VENTA_CLIENTE, {
    onCompleted: (data) => {
      if (data.nuevaVentaCliente.success === true) {
        setMessage(`${data.nuevaVentaCliente.message}. Cambio: ${cambio}`);
        setSuccess(true);
      } else {
        setMessage(data.nuevaVentaCliente.message);
      }
    },
    refetchQueries: [
      {
        query: PLAZA,
        variables: { _id: plazaState._idPunto },
      },
    ],
  });

  const [nuevaVentaPuntoDeVentaFunction] = useMutation<
    nuevaVentaPuntoDeVenta,
    nuevaVentaPuntoDeVentaVariables
  >(NUEVA_VENTA_PUNTO_DE_VENTA, {
    onCompleted: (data) => {
      if (data.nuevaVentaPuntoDeVenta.success === true) {
        setMessage(data.nuevaVentaPuntoDeVenta.message);
        setSuccess(true);
      } else {
        setMessage(data.nuevaVentaPuntoDeVenta.message);
      }
    },
    refetchQueries: [
      {
        query: PLAZA,
        variables: { _id: plazaState._idPunto },
      },
    ],
  });

  const [nuevoPago] = useMutation(NUEVO_PAGO, {
    refetchQueries: [
      {
        query: PLAZA,
        variables: { _id: plazaState._idPunto },
      },
    ],
  });

  const finalizarVenta = async (
    articulos: DatosTablaPrendas[],
    noImprimir: boolean | null
  ) => {
    const ticketArgs: Required<ImpresionDeTicketsArgs> = {
      infoPunto: plazaState.infoPunto || 'GIRL STATE <br><br>',
      articulos,
      cliente: values.cliente ? values.cliente.nombre : null,
      cantidadPagada: values.cantidadPagada,
      cambio: typeof cambio === 'number' ? cambio : null,
      fecha: dayjs().toISOString(),
    };
    if (
      values.tipoDeImpresion === 'imprimir' &&
      (noImprimir == null || !noImprimir)
    ) {
      const data = crearTicketData(ticketArgs);
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
    }
    if (values.tipoDeImpresion === 'imprimirA5' && values.cliente !== '') {
      const doc = (
        <Notas
          articulos={articulos}
          fecha={dayjs()}
          nombre={values.cliente.nombre}
        />
      );
      const blob = await pdf(doc).toBlob();
      const Url = window.URL.createObjectURL(blob);
      const win = new BrowserWindow({ width: 600, height: 800 });
      win.loadURL(Url);
    }
    if (docTicket) restablecerTicket(docTicket);
    dispatch(modificarUltimoTicket(ticketArgs));
    resetForm();
    setCobrarOpen(false);
    setDialogOpen(false);
  };

  const handleCobrar = async (noImprimir: boolean | null = null) => {
    if (
      !submitting &&
      pPrendas &&
      pPrendas.length > 0 &&
      total &&
      plazaState._idPunto &&
      plazaState.idInventario
    ) {
      const _id = new ObjectId();
      const prendasTicket = await datosParaTablaDePrendas(pPrendas);
      setSubmitting(true);
      const ventaOffline: plaza_plaza_ventas = {
        _id: _id.toString(),
        Fecha: fechaPorId(_id),
        Nombre: `sin conexión: ${
          values.cliente !== '' ? values.cliente.nombre : 'público en general'
        }`,
        Monto: total,
        // @ts-expect-error:err
        ar: pPrendas,
        ca: false,
        Comentarios: values.comentarios,
      };
      if (values.cliente !== '') {
        const { nombre } = values.cliente;
        const cliente = values.cliente;
        if (values.tipoDePago === 'efectivo') {
          const pagoVariables: nuevoPagoVariables = {
            _id: new ObjectId().toString(),
            nombre,
            obj: {
              cl: cliente._id,
              ti: TipoDePago.efectivo,
              mo: values.cantidadPagada,
              co: values.comentarios,
            },
            puntoId: plazaState._idPunto,
          };
          if (plazaState.online) {
            await nuevoPago({
              variables: pagoVariables,
            });
          } else {
            await mutationVariablesDoc.atomicUpdate((oldData) => {
              oldData.pago.push(pagoVariables);
              return oldData;
            });
            await plazaDoc.atomicUpdate((oldData) => {
              oldData.pagos?.unshift({
                _id: _id.toString(),
                cliente: cliente._id,
                Fecha: fechaPorId(_id),
                Nombre: `sin conexión: ${cliente.nombre}`,
                Tipo: 'efectivo',
                Monto: values.cantidadPagada,
                Comentarios: values.comentarios,
                ca: false,
              });
              return oldData;
            });
          }
        }
        const ventaClienteVariables: nuevaVentaClienteVariables = {
          _id: _id.toString(),
          args: {
            in: plazaState.idInventario,
            cl: cliente._id,
            prendas: pPrendas,
            di: undefined,
            co: values.comentarios !== '' ? values.comentarios : undefined,
          },
          nombre,
          puntoId: plazaState._idPunto,
        };
        if (plazaState.online) {
          await nuevaVentaClienteFunction({
            variables: ventaClienteVariables,
          }).then((res) => {
            if (res.data && res.data.nuevaVentaCliente.success === true) {
              finalizarVenta(prendasTicket, noImprimir);
            }
          });
        } else {
          await mutationVariablesDoc.atomicUpdate((oldData) => {
            oldData.venta_cliente.push(ventaClienteVariables);
            return oldData;
          });
          await plazaDoc.atomicUpdate((oldData) => {
            oldData.ventas?.unshift(ventaOffline);
            return oldData;
          });
        }
      } else {
        const ventaPuntoDeVentaVariables: nuevaVentaPuntoDeVentaVariables = {
          args: {
            in: plazaState.idInventario,
            prendas: pPrendas,
            co: values.comentarios,
          },
          puntoId: plazaState._idPunto,
          _id: _id.toString(),
        };
        if (plazaState.online) {
          await nuevaVentaPuntoDeVentaFunction({
            variables: ventaPuntoDeVentaVariables,
          }).then((res) => {
            if (res.data && res.data.nuevaVentaPuntoDeVenta.success === true) {
              finalizarVenta(prendasTicket, noImprimir);
            }
          });
        } else {
          await mutationVariablesDoc.atomicUpdate((oldData) => {
            oldData.venta_punto.push(ventaPuntoDeVentaVariables);
            return oldData;
          });
          await plazaDoc.atomicUpdate((oldData) => {
            oldData.ventas?.unshift(ventaOffline);
            return oldData;
          });
        }
      }
      if (!plazaState.online) {
        finalizarVenta(prendasTicket, noImprimir);
        setMessage(`Venta añadida. Cambio: ${cambio}`);
        setSuccess(true);
      }
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setCobrarOpen(false);
      setDialogOpen(false);
    }
  };
  const keyMap = {
    COBRAR_CLICK: 'ctrl+enter',
    COBRAR_CLICKI: 'f1',
    COBRAR_CLICKN: 'f2',
  };

  const handlers = {
    COBRAR_CLICK: () => {
      handleCobrar();
    },
    COBRAR_CLICKI: () => {
      handleCobrar();
    },
    COBRAR_CLICKN: () => {
      handleCobrar(true);
    },
  };

  return (
    <HotKeys allowChanges handlers={handlers} keyMap={keyMap}>
      <Dialog fullWidth maxWidth="sm" onClose={handleClose} open={open}>
        <Box height="auto">
          <DialogContent>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                {values.cliente !== '' && (
                  <Typography variant="subtitle1">
                    {`Cliente: ${values.cliente.nombre}`}
                  </Typography>
                )}
                {pRevision && (
                  <RevisionDeArticulos articulos={pRevision} conPrecio />
                )}
                {values.tipoDePago === 'efectivo' && (
                  <Box mt={1}>
                    <Typography variant="subtitle1">{`Cambio: ${cambio}`}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                <Field component={RadioGroup} name="tipoDePago">
                  <FormControlLabel
                    control={<Radio disabled={submitting} />}
                    disabled={submitting}
                    label="Efectivo"
                    value="efectivo"
                  />
                  {values.cliente !== '' && (
                    <FormControlLabel
                      control={<Radio disabled={submitting} />}
                      disabled={submitting}
                      label="Dejar pago pendiente"
                      value="pendiente"
                    />
                  )}
                </Field>
              </Grid>
              {values.tipoDePago === 'efectivo' && (
                <Grid item xs={12}>
                  <TextField
                    autoFocus
                    error={
                      (Boolean(touched.cantidadPagada) &&
                        Boolean(errors.cantidadPagada)) ||
                      (values.cliente === '' && values.cantidadPagada < total)
                    }
                    fullWidth
                    helperText={touched.cantidadPagada && errors.cantidadPagada}
                    id="cantidadPagada"
                    InputProps={{
                      inputComponent: MoneyFormat,
                    }}
                    inputProps={{ maxLength: 11 }}
                    label="Cantidad pagada"
                    margin="dense"
                    name="cantidadPagada"
                    onChange={(e) => {
                      const { value } = e.target;
                      const nuevoValue =
                        parseFloat(value.replace(/[,$]+/g, '')) || 0;
                      let nuevoCambio;
                      if (nuevoValue - total >= 0) {
                        nuevoCambio = Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(nuevoValue - total);
                      } else {
                        nuevoCambio = '-----';
                      }
                      setCambio(nuevoCambio);
                      setFieldValue('cantidadPagada', nuevoValue, false);
                    }}
                    onFocus={(e) => {
                      e.preventDefault();
                      const { target } = e;
                      target.focus();
                      target.select();
                    }}
                    value={
                      values.cantidadPagada === 0
                        ? total
                        : values.cantidadPagada
                    }
                    variant="outlined"
                  />
                </Grid>
              )}
              {/* <Grid item xs={12}>
                <TextField
                  error={touched.comentarios && Boolean(errors.comentarios)}
                  fullWidth
                  helperText={touched.comentarios && errors.comentarios}
                  id="comentarios"
                  inputProps={{ maxLength: 75 }}
                  label="Comentarios"
                  margin="dense"
                  name="comentarios"
                  onBlur={(handleChange)}
                  value={values.comentarios}
                  variant="outlined"
                />
              </Grid> */}
              <Grid item xs={12}>
                <Divider />
                <Divider />
                <Divider />
                <Field component={RadioGroup} name="tipoDeImpresion">
                  <Tooltip title={<h3>F1</h3>}>
                    <span>
                      <FormControlLabel
                        control={<Radio disabled={submitting} />}
                        disabled={submitting}
                        label="Cobrar e imprimir"
                        value="imprimir"
                      />
                    </span>
                  </Tooltip>
                  <Tooltip title={<h3>F2</h3>}>
                    <span>
                      <FormControlLabel
                        control={<Radio disabled={submitting} />}
                        disabled={submitting}
                        label="Cobrar solo registrando la venta"
                        value="noImprimir"
                      />
                    </span>
                  </Tooltip>
                  {values.cliente !== '' && (
                    <FormControlLabel
                      control={<Radio disabled={submitting} />}
                      disabled={submitting}
                      label="Imprimir nota A5"
                      value="imprimirA5"
                    />
                  )}
                </Field>
                {submitting && (
                  <Box>
                    <LinearProgress />
                  </Box>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Tooltip title="ESC">
              <Button color="default" onClick={handleClose} size="small">
                Cancelar
              </Button>
            </Tooltip>
            <Tooltip title="CTRL+ENTER">
              <span>
                <Button
                  color="primary"
                  disabled={
                    submitting ||
                    (values.cliente === '' && values.cantidadPagada < total)
                  }
                  onClick={() => handleCobrar()}
                  size="small"
                  type="submit"
                  variant="outlined"
                >
                  Cobrar
                </Button>
              </span>
            </Tooltip>
          </DialogActions>
        </Box>
      </Dialog>
    </HotKeys>
  );
};

export default CobrarForm;
