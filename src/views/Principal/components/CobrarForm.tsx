import React, { useState } from 'react';
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
import LinearProgress from '@material-ui/core/LinearProgress';
import { useMutation } from '@apollo/client';
import { RadioGroup } from 'formik-material-ui';
import Radio from '@material-ui/core/Radio';
import { useSelector, useDispatch } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import ObjectId from 'bson-objectid';
import { assign, groupBy } from 'lodash';
import { HotKeys } from 'react-hotkeys';
import dayjs from 'dayjs';
import { pdf } from '@react-pdf/renderer';
import Notas from './Notas';
import { ArticuloDB, PrincipalValues, Session } from '../../../types/types';
import { RootState } from '../../../types/store';
import { NuevaVenta, NuevaVentaVariables } from '../../../types/apollo';
import { MoneyFormat } from '../../../utils/TextFieldFormats';

import { NUEVA_VENTA, NUEVO_PAGO } from '../../../utils/mutations';
import { MOVIMIENTOS } from '../../../utils/queries';
import crearTicketData from '../../../utils/crearTicketData';
import { modificarUltimoTicket } from '../../../actions/sessionActions';

const { ipcRenderer } = window.require('electron');
const electron = window.require('electron');
const { remote } = electron;
const { BrowserWindow } = remote;

interface CobrarFormProps {
  open: boolean;
  setCobrarOpen: (a: boolean) => void;
  setDialogOpen: (a: boolean) => void;
  setMessage: (a: string | null) => void;
  setSuccess: (a: boolean) => void;
}
const CobrarForm = (props: CobrarFormProps): JSX.Element => {
  const { open, setCobrarOpen, setDialogOpen, setMessage, setSuccess } = props;
  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleBlur,
    handleChange,
    resetForm,
  } = useFormikContext<PrincipalValues>();
  const [submitting, setSubmitting] = useState(false);
  const [cambio, setCambio] = useState('$0.00');
  const total = values.articulos.reduce((acc, cur) => {
    return acc + cur.precio * cur.cantidad;
  }, 0);
  const NoDeArticulos = values.articulos.reduce((acc, cur) => {
    return acc + cur.cantidad;
  }, 0);

  const session: Session = useSelector((state: RootState) => state.session);
  const dispatch = useDispatch();

  const [nuevaVenta] = useMutation<NuevaVenta, NuevaVentaVariables>(
    NUEVA_VENTA,
    {
      onCompleted: (data) => {
        if (data.nuevaVenta.success === true) {
          setMessage(`${data.nuevaVenta.message}. Cambio: ${cambio}`);
          setSuccess(true);
        } else {
          setMessage(data.nuevaVenta.message);
        }
      },
      onError: (error) => {
        setMessage(JSON.stringify(error, null, 4));
      },
      refetchQueries: [
        {
          query: MOVIMIENTOS,
          variables: { _id: session.puntoIdActivo },
        },
      ],
    }
  );
  // solo para clientes
  const [nuevoPago] = useMutation(NUEVO_PAGO, {
    onError: (error) => {
      setMessage(JSON.stringify(error, null, 4));
    },
    refetchQueries: [
      {
        query: MOVIMIENTOS,
        variables: { _id: session.puntoIdActivo },
      },
    ],
  });

  const finalizarVenta = async (
    articulos: ArticuloDB[],
    noImprimir: boolean | null
  ) => {
    if (
      values.tipoDeImpresion === 'imprimir' &&
      (noImprimir == null || !noImprimir)
    ) {
      const data = crearTicketData(
        session.infoPunto,
        articulos,
        // @ts-expect-error: error
        values.cliente.nombre,
        values.cantidadPagada,
        cambio
      );
      if (session.ancho && session.impresora) {
        ipcRenderer.send('PRINT', {
          data,
          impresora: session.impresora,
          ancho: session.ancho,
        });
      } else {
        // eslint-disable-next-line no-alert
        alert('seleccione una impresora y un ancho');
      }
    }
    if (values.tipoDeImpresion === 'imprimirA5') {
      const doc = (
        <Notas
          articulos={articulos}
          fecha={dayjs()}
          // @ts-expect-error: error
          nombre={values.cliente.nombre}
        />
      );
      const blob = await pdf(doc).toBlob();
      const Url = window.URL.createObjectURL(blob);
      const win = new BrowserWindow({ width: 600, height: 800 });
      win.loadURL(Url);
    }
    const ultimoTicket = {
      infoPunto: session.infoPunto,
      articulos,
      // @ts-expect-error: error
      cliente: values.cliente.nombre,
      cantidadPagada: values.cantidadPagada,
      cambio,
    };
    dispatch(
      modificarUltimoTicket({
        ultimoTicket,
      })
    );
    resetForm();
    setCobrarOpen(false);
    setDialogOpen(false);
  };

  const handleCobrar = async (noImprimir: boolean | null = null) => {
    const articulos: ArticuloDB[] = values.articulos.map((val) => {
      return {
        articulo: val.articulo.nombre,
        cantidad: val.cantidad,
        precio: val.precio,
      };
    });
    if (!submitting && articulos.length > 0) {
      const prendasAgrupadasObj = groupBy(articulos, 'articulo');
      const prendasAgrupadas = Object.keys(prendasAgrupadasObj).map((key) => {
        return {
          articulo: key,
          cantidad: prendasAgrupadasObj[key].reduce((acc, cur) => {
            return acc + cur.cantidad;
          }, 0),
          precio: prendasAgrupadasObj[key][0].precio,
        };
      });
      setSubmitting(true);
      const puntoId = session.puntoIdActivo;
      const { nombre } = session;
      let objPagoOffline;
      const objOffline = {
        _id: new ObjectId().toString(),
        Fecha: new Date().toISOString(),
        Tipo: 'Sin conexión: venta',
        Monto: total,
        Pago: null,
        Prendas: NoDeArticulos,
        articulos: prendasAgrupadas,
        comentarios: values.comentarios,
      };
      if (values.cliente) {
        const objVenta = {
          cliente: values.cliente._id,
          tipo: `entrega en ${session.nombre}`,
          articulos: prendasAgrupadas,
        };
        if (values.comentarios !== '') {
          assign(objVenta, { comentarios: values.comentarios });
        }
        const cliente = values.cliente.nombre;
        const ventaVariables = {
          objVenta,
          monto: total,
          cliente,
          nombre,
          puntoId,
        };
        if (values.tipoDePago === 'pendiente') {
          if (session.online) {
            await nuevaVenta({
              variables: ventaVariables,
            }).then((res) => {
              if (res.data && res.data.nuevaVenta.success === true) {
                finalizarVenta(prendasAgrupadas, noImprimir);
              }
            });
          } else {
            assign(ventaVariables, { _idOffline: objOffline._id });
            ipcRenderer.send('VENTAS_CLIENTES', ventaVariables);
            assign(objOffline, {
              Tipo: `Sin conexión: venta: ${cliente}`,
              Pago: 0,
            });
          }
        } else if (values.tipoDePago === 'efectivo') {
          const objPago = {
            cliente: values.cliente._id,
            tipo: 'efectivo',
            monto: values.cantidadPagada,
          };
          const pagoVariables = {
            cliente,
            objPago,
          };
          if (session.online) {
            await nuevoPago({
              variables: pagoVariables,
            }).then(async (pagoRes) => {
              if (pagoRes.data.nuevoPago.success === true) {
                assign(ventaVariables, { idPago: pagoRes.data.nuevoPago._id });
                await nuevaVenta({
                  variables: ventaVariables,
                }).then((res) => {
                  if (res.data && res.data.nuevaVenta.success === true) {
                    finalizarVenta(prendasAgrupadas, noImprimir);
                  }
                });
              }
            });
          } else {
            assign(ventaVariables, { _idOffline: objOffline._id });
            ipcRenderer.send('VENTAS_CLIENTES', ventaVariables);
            assign(objOffline, {
              Tipo: `Sin conexión: venta: ${cliente}`,
              Pago: 0,
            });
            objPagoOffline = {
              _id: new ObjectId().toString(),
              Fecha: new Date().toISOString(),
              Tipo: `Sin conexión: pago: ${cliente}`,
              Monto: values.cantidadPagada,
              Pago: null,
              Prendas: 0,
              articulos: null,
              comentarios: values.comentarios,
            };
            assign(pagoVariables, {
              _idOffline: objPagoOffline._id,
              puntoId: session.puntoIdActivo,
            });
            ipcRenderer.send('PAGOS_CLIENTES', pagoVariables);
          }
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const _id = new ObjectId();
        const objVenta = {
          _id,
          tipo: 'venta',
          articulos: prendasAgrupadas,
        };
        if (values.comentarios !== '') {
          assign(objVenta, { comentarios: values.comentarios });
        }
        const variables = {
          objVenta,
          puntoId,
          nombre,
        };
        if (session.online) {
          await nuevaVenta({
            variables,
          }).then((res) => {
            if (res.data && res.data.nuevaVenta.success === true) {
              finalizarVenta(prendasAgrupadas, noImprimir);
            }
          });
        } else {
          assign(variables, {
            _idOffline: objOffline._id,
            objVenta: {
              _id: _id.toString(),
              tipo: 'venta',
              articulos: prendasAgrupadas,
            },
          });
          ipcRenderer.send('VENTAS', variables);
        }
      }
      if (!session.online) {
        finalizarVenta(prendasAgrupadas, noImprimir);
        await ipcRenderer.send('MOVIMIENTOS_OFFLINE', objOffline);
        if (objPagoOffline) {
          ipcRenderer.send('MOVIMIENTOS_OFFLINE', objPagoOffline);
        }
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
      <Dialog onClose={handleClose} open={open}>
        <Box width={400}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {values.cliente !== '' && (
                  <Typography variant="subtitle1">
                    {`Cliente: ${values.cliente.nombre}`}
                  </Typography>
                )}
                <Typography variant="subtitle1">
                  {`Total: ${Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(total)}`}
                </Typography>
                <Typography variant="subtitle1">
                  {`Número de artículos  : ${NoDeArticulos}`}
                </Typography>
                {values.tipoDePago === 'efectivo' && (
                  <Typography variant="subtitle1">{`Cambio: ${cambio}`}</Typography>
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
                    error={
                      (Boolean(touched.cantidadPagada) &&
                        Boolean(errors.cantidadPagada)) ||
                      (values.cliente === '' && values.cantidadPagada < total)
                    }
                    focused
                    fullWidth
                    helperText={touched.cantidadPagada && errors.cantidadPagada}
                    id="cantidadPagada"
                    InputProps={{
                      inputComponent: MoneyFormat,
                    }}
                    inputProps={{ maxLength: 11 }}
                    inputRef={(input) =>
                      input && input.focus() && input.select()
                    }
                    label="Cantidad pagada"
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
                    onFocus={(event) => {
                      event.preventDefault();
                      const { target } = event;
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
              <Grid item xs={12}>
                <TextField
                  error={touched.comentarios && Boolean(errors.comentarios)}
                  fullWidth
                  helperText={touched.comentarios && errors.comentarios}
                  id="comentarios"
                  label="Comentarios"
                  multiline
                  name="comentarios"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.comentarios}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Field component={RadioGroup} name="tipoDeImpresion">
                  <Tooltip title={<h3>F1</h3>}>
                    <FormControlLabel
                      control={<Radio disabled={submitting} />}
                      disabled={submitting}
                      label="Cobrar e imprimir"
                      value="imprimir"
                    />
                  </Tooltip>
                  <Tooltip title={<h3>F2</h3>}>
                    <FormControlLabel
                      control={<Radio disabled={submitting} />}
                      disabled={submitting}
                      label="Cobrar solo registrando la venta"
                      value="noImprimir"
                    />
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
            </Tooltip>
          </DialogActions>
        </Box>
      </Dialog>
    </HotKeys>
  );
};

export default CobrarForm;
