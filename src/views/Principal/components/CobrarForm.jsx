/* eslint-disable promise/no-nesting */
/* eslint-disable promise/always-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/jsx-props-no-spreading */
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
import { assign } from 'lodash';
import { MoneyFormat } from '../../../utils/TextFieldFormats';

import { NUEVA_VENTA, NUEVO_PAGO } from '../../../utils/mutations';
import { INVENTARIO, MOVIMIENTOS } from '../../../utils/queries';
import crearTicketData from '../../../utils/crearTicketData';
import { modificarUltimoTicket } from '../../../actions/sessionActions';

const { remote } = window.require('electron');
const { PosPrinter } = remote.require('electron-pos-printer');

const CobrarForm = (props) => {
  const { open, setCobrarOpen, setDialogOpen, setMessage, setSuccess } = props;
  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleBlur,
    handleChange,
    resetForm,
  } = useFormikContext();
  const [submitting, setSubmitting] = useState(false);
  const [cambio, setCambio] = useState('$0.00');
  const total = values.articulos.reduce((acc, cur) => {
    return acc + cur.precio * cur.cantidad;
  }, 0);
  const NoDeArticulos = values.articulos.reduce((acc, cur) => {
    return acc + cur.cantidad;
  }, 0);

  const session = useSelector((state) => state.session);
  const dispatch = useDispatch();

  const [nuevaVenta] = useMutation(NUEVA_VENTA, {
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
        query: INVENTARIO,
        variables: { nombre: session.nombre },
      },
      {
        query: MOVIMIENTOS,
        variables: { _id: session.puntoIdActivo },
      },
    ],
  });
  // solo para clientes
  const [nuevoPago] = useMutation(NUEVO_PAGO, {
    onError: (error) => {
      setMessage(JSON.stringify(error, null, 4));
    },
  });

  const handleCobrar = async () => {
    setSubmitting(true);
    let data;
    let options;
    const puntoId = session.puntoIdActivo;
    const { nombre } = session;
    const articulos = values.articulos.map((val) => {
      return {
        articulo: val.articulo.nombre,
        cantidad: val.cantidad,
        precio: val.precio,
      };
    });
    if (values.tipoDeImpresion === 'imprimir') {
      options = {
        preview: false,
        width: session.ancho,
        margin: '0 0 0 0',
        copies: 1,
        printerName: session.impresora,
        timeOutPerLine: 2000,
        silent: true,
      };
      data = crearTicketData(
        session.infoPunto,
        articulos,
        values.cliente.nombre,
        values.cantidadPagada,
        cambio
      );
    }
    if (values.cliente) {
      const objVenta = {
        cliente: values.cliente._id,
        tipo: `entrega en ${session.nombre}`,
        articulos,
      };
      if (values.comentarios !== '') {
        assign(objVenta, { comentarios: values.comentarios });
      }
      const cliente = values.cliente.nombre;
      if (values.tipoDePago === 'pendiente') {
        await nuevaVenta({
          variables: {
            objVenta,
            monto: total,
            cliente,
            nombre,
            puntoId,
          },
        }).then((res) => {
          if (res.data.nuevaVenta.success === true) {
            resetForm();
          }
        });
      } else if (values.tipoDePago === 'efectivo') {
        const objPago = {
          cliente: values.cliente._id,
          tipo: 'efectivo',
          monto: values.cantidadPagada,
        };
        await nuevaVenta({
          variables: {
            objVenta,
            monto: total,
            cliente,
            nombre,
            puntoId,
          },
        }).then((res) => {
          if (res.data.nuevaVenta.success === true) {
            if (values.tipoDeImpresion === 'imprimir') {
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
            }
            const ultimoTicket = {
              infoPunto: session.infoPunto,
              articulos,
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
          }
          nuevoPago({
            variables: {
              monto: values.cantidadPagada,
              cliente,
              objPago,
            },
          });
        });
      }
    } else {
      const objVenta = {
        _id: ObjectId(),
        tipo: 'venta',
        articulos,
      };
      if (values.comentarios !== '') {
        assign(objVenta, { comentarios: values.comentarios });
      }
      await nuevaVenta({
        variables: {
          objVenta,
          puntoId,
          nombre,
        },
      }).then((res) => {
        if (res.data.nuevaVenta.success === true) {
          if (values.tipoDeImpresion === 'imprimir') {
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
          }
          const ultimoTicket = {
            infoPunto: session.infoPunto,
            articulos,
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
        }
      });
    }
    setSubmitting(false);
  };

  const handleClose = () => {
    if (!submitting) {
      setCobrarOpen(false);
      setDialogOpen(false);
    }
  };

  return (
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
                    (touched.cantidadPagada && errors.cantidadPagada) ||
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
                    event.target.select();
                  }}
                  value={
                    values.cantidadPagada === 0 ? total : values.cantidadPagada
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
                <FormControlLabel
                  control={<Radio disabled={submitting} />}
                  disabled={submitting}
                  label="Cobrar e imprimir"
                  value="imprimir"
                />
                <FormControlLabel
                  control={<Radio disabled={submitting} />}
                  disabled={submitting}
                  label="Cobrar solo registrando la venta"
                  value="noImprimir"
                />
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
          <Button
            autoFocus
            color="primary"
            disabled={
              submitting ||
              (values.cliente === '' && values.cantidadPagada < total)
            }
            onClick={handleCobrar}
            size="small"
            type="submit"
            variant="outlined"
          >
            Cobrar
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CobrarForm;
