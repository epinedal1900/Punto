/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable promise/always-return */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useMutation } from '@apollo/client';
import { useSelector } from 'react-redux';
import { assign } from 'lodash';
import ObjectId from 'bson-objectid';

import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { MoneyFormat } from '../../../utils/TextFieldFormats';

import { AutocompleteField } from '../../../components';

import { NUEVO_PAGO } from '../../../utils/mutations';
import { MOVIMIENTOS } from '../../../utils/queries';

const { ipcRenderer } = window.require('electron');

const validationSchema = yup.object({
  cliente: yup.object().required('requerido'),
  monto: yup.number().min(1, 'requerido').required('requerido'),
  comentarios: yup.string(),
});

const NuevoPago = (props) => {
  const {
    clientes,
    setMessage,
    setSuccess,
    setDialogOpen,
    setPagoOpen,
    open,
  } = props;
  const initialValues = {
    cliente: '',
    monto: 0,
    comentarios: '',
  };
  const session = useSelector((state) => state.session);

  const [nuevoPago] = useMutation(NUEVO_PAGO, {
    onCompleted: (data) => {
      if (data.nuevoPago.success === true) {
        setMessage(data.nuevoPago.message);
        setSuccess(true);
        setDialogOpen(false);
        setPagoOpen(false);
      } else {
        setMessage(data.nuevoPago.message);
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
  });

  const handleAgregar = async (values, actions) => {
    const cliente = values.cliente.nombre;
    const objPago = {
      cliente: values.cliente._id,
      tipo: 'efectivo',
      monto: values.monto,
      comentarios: values.comentarios,
    };
    const variables = {
      cliente,
      objPago,
      puntoId: session.puntoIdActivo,
    };
    if (session.online) {
      await nuevoPago({
        variables,
      }).then((res) => {
        if (res.data.nuevoPago.success === true) {
          actions.resetForm();
        }
      });
    } else {
      const objOffline = {
        _id: ObjectId().toString(),
        Fecha: new Date().toISOString(),
        Tipo: `Sin conexión: pago: ${values.cliente.nombre}`,
        Monto: values.monto,
        Pago: null,
        Prendas: 0,
        articulos: null,
        comentarios: values.comentarios,
      };
      assign(variables, {
        _idOffline: objOffline._id,
      });
      ipcRenderer.send('PAGOS_CLIENTES', variables);
      ipcRenderer.send('MOVIMIENTOS_OFFLINE', objOffline);
      actions.resetForm();
      setMessage('Pago añadido');
      setSuccess(true);
      setDialogOpen(false);
      setPagoOpen(false);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    setPagoOpen(false);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleAgregar}
        validateOnBlur={false}
        validateOnChange={false}
        validationSchema={validationSchema}
      >
        {({
          errors,
          values,
          handleSubmit,
          isSubmitting,
          handleBlur,
          handleChange,
          touched,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Pago en efectivo</Typography>
                </Grid>
                <Grid item xs={12}>
                  <AutocompleteField
                    getOptionsLabel={(option) =>
                      option.nombre ? option.nombre : ''
                    }
                    label="Cliente"
                    options={clientes}
                    valueName="cliente"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={touched.monto && errors.monto}
                    fullWidth
                    helperText={touched.monto && errors.monto}
                    id="monto"
                    InputProps={{
                      inputComponent: MoneyFormat,
                    }}
                    inputProps={{ maxLength: 11 }}
                    label="Monto"
                    name="monto"
                    onBlur={(e) => {
                      let { value } = e.target;
                      value = parseFloat(value.replace(/[,$]+/g, '')) || 0;
                      setFieldValue('monto', value, false);
                    }}
                    value={values.monto === 0 ? '' : values.monto}
                    variant="outlined"
                  />
                </Grid>
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
                {isSubmitting && (
                  <Grid item xs={12}>
                    <LinearProgress />
                  </Grid>
                )}
              </Grid>
              {/* <h2>{JSON.stringify(values)}</h2> */}
            </DialogContent>
            <DialogActions>
              <Button
                color="default"
                disabled={isSubmitting}
                onClick={handleClose}
                size="small"
              >
                Cancelar
              </Button>
              <Button
                autoFocus
                color="primary"
                disabled={isSubmitting}
                size="small"
                type="submit"
                variant="contained"
              >
                Añadir
              </Button>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default NuevoPago;
