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
import { Formik, FormikHelpers } from 'formik';
import { useSelector } from 'react-redux';
import ObjectId from 'bson-objectid';

import { assign } from 'lodash';
import { ArticuloForm, ArticuloOption, Session } from '../../../types/types';
import { RootState } from '../../../types/store';
import { NuevoRegreso, NuevoRegresoVariables } from '../../../types/apollo';
import { NUEVO_REGRESO } from '../../../utils/mutations';
import { MOVIMIENTOS } from '../../../utils/queries';
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
      (values: any) => values.length > 0
    ),
});
interface RegresoValues {
  articulos: ArticuloForm[];
  comentarios: string;
}

interface RegresoFormProps {
  opcionesArticulos: ArticuloOption[];
  open: boolean;
  setDialogOpen: (a: boolean) => void;
  setRegresoOpen: (a: boolean) => void;
  setMessage: (a: string | null) => void;
  setSuccess: (a: boolean) => void;
}
const RegresoForm = (props: RegresoFormProps): JSX.Element => {
  const {
    opcionesArticulos,
    open,
    setDialogOpen,
    setRegresoOpen,
    setMessage,
    setSuccess,
  } = props;
  const session: Session = useSelector((state: RootState) => state.session);

  const [nuevoRegreso, { loading }] = useMutation<
    NuevoRegreso,
    NuevoRegresoVariables
  >(NUEVO_REGRESO, {
    onCompleted: (data) => {
      if (data.nuevoRegreso.success === true) {
        setMessage(data.nuevoRegreso.message);
        setSuccess(true);
      } else {
        setMessage(data.nuevoRegreso.message);
      }
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
    setRegresoOpen(false);
  };

  const handleSubmit = async (
    values: RegresoValues,
    actions: FormikHelpers<RegresoValues>
  ) => {
    const articulos = values.articulos.map((val) => {
      return { articulo: val.articulo.nombre, cantidad: val.cantidad };
    });
    const obj = {
      tipo: 'regreso',
      articulos,
    };
    if (values.comentarios !== '') {
      assign(obj, { comentarios: values.comentarios });
    }
    const variables = {
      obj,
      puntoId: session.puntoIdActivo,
      nombre: session.nombre,
    };
    if (session.online) {
      await nuevoRegreso({
        variables,
      }).then((res) => {
        if (res.data && res.data.nuevoRegreso.success === true) {
          actions.resetForm();
          setDialogOpen(false);
          setRegresoOpen(false);
        }
      });
    } else {
      const NoDeArticulos = articulos.reduce((acc, cur) => {
        return acc + cur.cantidad;
      }, 0);
      const objOffline = {
        _id: new ObjectId().toString(),
        Fecha: new Date().toISOString(),
        Tipo: 'Sin conexión: regreso',
        Monto: 0,
        Pago: null,
        Prendas: NoDeArticulos,
        articulos,
        comentarios: values.comentarios,
      };
      assign(variables, { _idOffline: objOffline._id });
      ipcRenderer.send('REGRESOS', variables);
      ipcRenderer.send('MOVIMIENTOS_OFFLINE', objOffline);
      actions.resetForm();
      setDialogOpen(false);
      setRegresoOpen(false);
      setMessage('Regreso añadido');
      setSuccess(true);
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <Formik
        initialValues={{
          // @ts-expect-error: error
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
                  <Typography variant="subtitle1">
                    Nuevo regreso de mercancía
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Articulos
                    incluirPrecio={false}
                    opcionesArticulos={opcionesArticulos}
                  />
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

export default RegresoForm;
