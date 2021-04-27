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
import * as yup from 'yup';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';

import { assign } from 'lodash';
import { NUEVO_INTERCAMBIO } from '../../../utils/mutations';
import { INVENTARIO, MOVIMIENTOS } from '../../../utils/queries';
import Articulos from '../../../formPartials/Articulos';

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
        query: INVENTARIO,
        variables: { nombre: session.nombre },
      },
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

  const handleSubmit = async (values, actions) => {
    const obj = {
      tipo: `salida a ${nombreEntrada}`,
      articulos: values.articulos.map((val) => {
        return { articulo: val.articulo.nombre, cantidad: val.cantidad };
      }),
    };
    if (values.comentarios !== '') {
      assign(obj, { comentarios: values.comentarios });
    }
    await nuevoIntercambio({
      variables: {
        obj,
        nombreEntrada,
        nombreSalida: session.nombre,
      },
    }).then((res) => {
      if (res.data.nuevoIntercambio.success === true) {
        actions.resetForm();
        setDialogOpen(false);
        setIntercambioOpen(false);
      }
    });
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <Formik
        initialValues={{
          articulos: [{ articulo: '', cantidad: 0 }],
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
                </Grid>
                <Grid item xs={12}>
                  <Articulos
                    incluirPrecio={false}
                    opcionesArticulos={opcionesArticulos}
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
