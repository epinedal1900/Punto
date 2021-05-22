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
import { Formik, Field, FormikHelpers } from 'formik';
import { useSelector } from 'react-redux';
import ObjectId from 'bson-objectid';

import { assign } from 'lodash';
import { NUEVO_INTERCAMBIO } from '../../../utils/mutations';
import { MOVIMIENTOS } from '../../../utils/queries';
import crearTicketSinPrecioData from '../../../utils/crearTicketSinPrecioData';
import Articulos from '../../../formPartials/Articulos';
import {
  ArticuloDB,
  ArticuloOption,
  IntercambioValues,
  Session,
} from '../../../types/types';
import { RootState } from '../../../types/store';
import {
  NuevoIntercambio,
  NuevoIntercambioVariables,
} from '../../../types/apollo';

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

interface NuevoIntercambioProps {
  opcionesArticulos: ArticuloOption[];
  open: boolean;
  setDialogOpen: (a: boolean) => void;
  setIntercambioOpen: (a: boolean) => void;
  setMessage: (a: string | null) => void;
  setSuccess: (a: boolean) => void;
}
const IntercambioForm = (props: NuevoIntercambioProps): JSX.Element => {
  const {
    opcionesArticulos,
    open,
    setDialogOpen,
    setIntercambioOpen,
    setMessage,
    setSuccess,
  } = props;
  const session: Session = useSelector((state: RootState) => state.session);

  const nombreEntrada =
    session.nombre === 'Pasillo 2' ? 'Pasillo 6' : 'Pasillo 2';

  const [nuevoIntercambio, { loading }] = useMutation<
    NuevoIntercambio,
    NuevoIntercambioVariables
  >(NUEVO_INTERCAMBIO, {
    onCompleted: (data) => {
      if (data.nuevoIntercambio.success === true) {
        setMessage(data.nuevoIntercambio.message);
        setSuccess(true);
      } else {
        setMessage(data.nuevoIntercambio.message);
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
    setIntercambioOpen(false);
  };
  const finalizar = (values: IntercambioValues, articulos: ArticuloDB[]) => {
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

  const handleSubmit = async (
    values: IntercambioValues,
    actions: FormikHelpers<IntercambioValues>
  ) => {
    // @ts-expect-error: error
    const articulos: ArticuloDB[] = values.articulos.map((val) => {
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
        if (res.data && res.data.nuevoIntercambio.success === true) {
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
        _id: new ObjectId().toString(),
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
      <Formik<IntercambioValues>
        initialValues={{
          // @ts-expect-error: error
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
                      control={<Radio disabled={formikProps.isSubmitting} />}
                      disabled={formikProps.isSubmitting}
                      label="Registrar e imprimir"
                      value="imprimir"
                    />
                    <FormControlLabel
                      control={<Radio disabled={formikProps.isSubmitting} />}
                      disabled={formikProps.isSubmitting}
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

export default IntercambioForm;
