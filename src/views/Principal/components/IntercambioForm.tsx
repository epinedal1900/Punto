/* eslint-disable promise/always-return */
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { useMutation } from '@apollo/client';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { RadioGroup } from 'formik-material-ui';
import Radio from '@material-ui/core/Radio';
import * as yup from 'yup';
import { Formik, Field } from 'formik';
import { useSelector } from 'react-redux';
import ObjectId from 'bson-objectid';

import { assign } from 'lodash';
import { NUEVO_INTERCAMBIO } from '../../../utils/mutations';
import { MOVIMIENTOS } from '../../../utils/queries';
import crearTicketSinPrecioData from '../../../utils/crearTicketSinPrecioData';
import Articulos from '../../../formPartials/Articulos';

const { ipcRenderer } = window.require('electron');

const validationSchema = yup.object({
  comentarios: yup.string(),
  articulos: yup
    .array()
    .of(
      yup.object().shape({
        articulo: yup.object().required('requerido'),
        cantidad: yup.number().required('requerido').min(1, 'requerido'),
      })
    )
    .test(
      'selected',
      'Ingrese al menos 1 artículo',
      (values) => values.length > 0
    ),
});

const NuevoIntercambio = (props) => {
  const {
    opcionesArticulos,
    open,
    setDialogOpen,
    setIntercambioOpen,
    setMessage,
    setSuccess,
  } = props;
  const session = useSelector((state) => state.session);

  const nombreEntrada =
    session.nombre === 'Pasillo 2' ? 'Pasillo 6' : 'Pasillo 2';

  const [nuevoIntercambio, { loading }] = useMutation(NUEVO_INTERCAMBIO, {
    onCompleted: (data) => {
      if (data.nuevoIntercambio.success === true) {
        setMessage(data.nuevoIntercambio.message);
        setSuccess(true);
      } else {
        setMessage(data.nuevoIntercambio.message);
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

  const handleClose = () => {
    setDialogOpen(false);
    setIntercambioOpen(false);
  };
  const finalizar = (values, articulos) => {
    if (values.tipoDeImpresion === 'imprimir') {
      const data = crearTicketSinPrecioData(session.infoPunto, articulos);
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
  };

  const handleSubmit = async (values, actions) => {
    const articulos = values.articulos.map((val) => {
      return { articulo: val.articulo.nombre, cantidad: val.cantidad };
    });
    const obj = {
      tipo: `salida a ${nombreEntrada}`,
      articulos,
    };
    if (values.comentarios !== '') {
      assign(obj, { comentarios: values.comentarios });
    }
    const variables = {
      obj,
      nombreEntrada,
      nombreSalida: session.nombre,
    };
    if (session.online) {
      await nuevoIntercambio({
        variables,
      }).then((res) => {
        if (res.data.nuevoIntercambio.success === true) {
          finalizar(values, articulos);
          actions.resetForm();
          setDialogOpen(false);
          setIntercambioOpen(false);
        }
      });
    } else {
      const NoDeArticulos = articulos.reduce((acc, cur) => {
        return acc + cur.cantidad;
      }, 0);
      const objOffline = {
        _id: ObjectId().toString(),
        Fecha: new Date().toISOString(),
        Tipo: `Sin conexión: salida a ${nombreEntrada}`,
        Monto: 0,
        Pago: null,
        Prendas: NoDeArticulos,
        articulos,
        comentarios: values.comentarios,
      };
      // eslint-disable-next-line no-underscore-dangle
      assign(variables, { _idOffline: objOffline._id });
      ipcRenderer.send('INTERCAMBIOS', variables);
      ipcRenderer.send('MOVIMIENTOS_OFFLINE', objOffline);
      finalizar(values, articulos);
      actions.resetForm();
      setDialogOpen(false);
      setIntercambioOpen(false);
      setMessage('Intercambio añadido');
      setSuccess(true);
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <Formik
        initialValues={{
          articulos: [{ articulo: '', cantidad: 0 }],
          tipoDeImpresion: 'imprimir',
          comentarios: '',
        }}
        onSubmit={handleSubmit}
        validateOnBlur={false}
        validateOnChange={false}
        validationSchema={validationSchema}
      >
        {(formikProps) => (
          <form onSubmit={formikProps.handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">{`Nuevo intercambio a ${nombreEntrada}`}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Articulos
                    incluirPrecio={false}
                    opcionesArticulos={opcionesArticulos}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field component={RadioGroup} name="tipoDeImpresion">
                    <FormControlLabel
                      control={<Radio disabled={formikProps.submitting} />}
                      disabled={formikProps.submitting}
                      label="Registrar e imprimir"
                      value="imprimir"
                    />
                    <FormControlLabel
                      control={<Radio disabled={formikProps.submitting} />}
                      disabled={formikProps.submitting}
                      label="Solo registrar"
                      value="noImprimir"
                    />
                  </Field>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={
                      formikProps.touched.comentarios &&
                      Boolean(formikProps.errors.comentarios)
                    }
                    fullWidth
                    helperText={
                      formikProps.touched.comentarios &&
                      formikProps.errors.comentarios
                    }
                    id="comentarios"
                    label="Comentarios"
                    multiline
                    name="comentarios"
                    onBlur={formikProps.handleBlur}
                    onChange={formikProps.handleChange}
                    value={formikProps.values.comentarios}
                    variant="outlined"
                  />
                  {(loading || formikProps.isSubmitting) && <LinearProgress />}
                  {/* <h2>{JSON.stringify(formikProps.values)}</h2> */}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                color="default"
                disabled={formikProps.isSubmitting}
                onClick={handleClose}
                size="small"
              >
                Cancelar
              </Button>
              <Button
                autoFocus
                color="primary"
                disabled={formikProps.isSubmitting}
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

export default NuevoIntercambio;
