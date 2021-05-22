/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, TextField, Grid } from '@material-ui/core';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import LinearProgress from '@material-ui/core/LinearProgress';
import { useQuery } from '@apollo/client';
import { ipcRenderer } from 'electron';
import { login } from '../../../actions';
import { USUARIO, PUNTO_ID_ACTIVO, MOVIMIENTOS } from '../../../utils/queries';

import { RootState } from '../../../types/store';
import { Role, Session } from '../../../types/types';
import {
  Movimientos,
  MovimientosVariables,
  PuntoIdActivo,
  PuntoIdActivoVariables,
  Usuario,
  UsuarioVariables,
} from '../../../types/apollo';
import { auth } from '../../../firebase';

// eslint-disable-next-line no-undef

const loginValidationSchema = yup.object({
  correo: yup
    .string()
    .trim()
    .email('ingrese un correo válido')
    .required('Campo requerido'),
  contraseña: yup.string().required('Campo requerido'),
});

const useStyles = makeStyles((theme) => ({
  root: {},
  fields: {
    margin: theme.spacing(-1),
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      flexGrow: 1,
      margin: theme.spacing(1),
    },
  },
  submitButton: {
    marginTop: theme.spacing(2),
    width: '100%',
  },
}));

const LoginForm = () => {
  const classes = useStyles();
  const session: Session = useSelector((state: RootState) => state.session);
  const [uid, setUid] = useState<{ uid: string } | null>(null);
  const [nombre, setNombre] = useState<{ nombre: string } | null>(null);
  const [idPunto, setidPunto] = useState<{ _id: string } | null>(null);
  const { refetch: getMovimientos } = useQuery<
    Movimientos,
    MovimientosVariables
  >(MOVIMIENTOS, {
    // @ts-expect-error: error
    variables: idPunto,
    skip: !idPunto,
  });
  const { refetch: getUser } = useQuery<Usuario, UsuarioVariables>(USUARIO, {
    // @ts-expect-error: error
    variables: uid || '',
    skip: !uid,
  });
  const { refetch: getId } = useQuery<PuntoIdActivo, PuntoIdActivoVariables>(
    PUNTO_ID_ACTIVO,
    {
      // @ts-expect-error: error
      variables: nombre || '',
      skip: !nombre,
    }
  );
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (session.loggedIn === 'true') {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box display="flex" justifyContent="center" m={0}>
      <Formik
        initialStatus=""
        initialValues={{
          correo: '',
          contraseña: '',
        }}
        onSubmit={async (values, actions) => {
          await auth
            .signInWithEmailAndPassword(
              values.correo.trim().toLowerCase(),
              values.contraseña
            )
            .then(async (res) => {
              if (res.user) {
                let _id: string;
                let nombreStr = '';
                let roles: Role[];
                let infoPunto: string | null;
                let sinAlmacen: boolean | null = false;
                await setUid({ uid: res.user.uid });
                // @ts-expect-error: error
                await getUser({ variables: { uid: res.user.uid } }).then(
                  (data) => {
                    if (data.data && data.data.usuario) {
                      roles = data.data.usuario.roles;
                      nombreStr = data.data.usuario.nombre;
                      _id = data.data.usuario._id;
                      infoPunto = data.data.usuario.infoPunto;
                      sinAlmacen = data.data.usuario.sinAlmacen;
                    }
                  }
                );
                await setNombre({ nombre: nombreStr });
                // @ts-expect-error: error
                await getId({ variables: { nombre: nombreStr } }).then(
                  async (data) => {
                    localStorage.setItem('loggedIn', 'true');
                    localStorage.setItem('roles', JSON.stringify(roles));
                    localStorage.setItem('nombre', nombreStr);
                    localStorage.setItem('infoPunto', infoPunto || '');
                    localStorage.setItem(
                      'sinAlmacen',
                      sinAlmacen ? 'true' : 'false'
                    );
                    await dispatch(
                      login({
                        uid: _id,
                        nombre: nombreStr,
                        roles: JSON.stringify(roles),
                        puntoIdActivo: data.data.puntoIdActivo,
                        infoPunto,
                        sinAlmacen,
                      })
                    );
                    history.push('/');
                    if (data.data.puntoIdActivo == null) {
                      // eslint-disable-next-line no-alert
                      alert('No hay ninguna plaza activa');
                    } else {
                      await setidPunto({ _id: data.data.puntoIdActivo });
                      await getMovimientos({
                        // @ts-expect-error: error
                        variables: { _id: data.data.puntoIdActivo },
                      }).then((movData) => {
                        ipcRenderer.send('PLAZA', movData.data.movimientos);
                      });
                      localStorage.setItem(
                        'puntoIdActivo',
                        data.data.puntoIdActivo
                      );
                    }
                  }
                );
              }
            })
            .catch((error) => {
              const errorCode = error.code;
              switch (errorCode) {
                case 'auth/auth/too-many-request':
                  actions.setStatus({
                    emailError:
                      'El accesso a está cuenta ha sido deshabilitado temporalmente debido a muchos intentos de ingreso fallidos, por favor cambie su contraseña',
                  });
                  break;
                default:
                  actions.setStatus({ emailError: 'Error, intente más tarde' });
              }
            });
        }}
        validationSchema={loginValidationSchema}
      >
        {({ status, ...formikProps }) => (
          <form onSubmit={formikProps.handleSubmit}>
            <div className={classes.fields}>
              <TextField
                error={
                  (formikProps.touched.correo &&
                    Boolean(formikProps.errors.correo)) ||
                  status.emailError
                }
                fullWidth
                helperText={
                  (formikProps.touched.correo && formikProps.errors.correo) ||
                  status.emailError
                }
                id="correo"
                label="Correo*"
                name="correo"
                onBlur={formikProps.handleBlur}
                onChange={(e) => {
                  formikProps.setStatus('');
                  formikProps.handleChange(e);
                }}
                value={formikProps.values.correo}
                variant="outlined"
              />
              <TextField
                error={
                  (formikProps.touched.contraseña &&
                    Boolean(formikProps.errors.contraseña)) ||
                  status.passwordError
                }
                fullWidth
                helperText={
                  (formikProps.touched.contraseña &&
                    formikProps.errors.contraseña) ||
                  status.passwordError
                }
                id="contraseña"
                label="Contraseña*"
                name="contraseña"
                onBlur={formikProps.handleBlur}
                onChange={(e) => {
                  formikProps.setStatus('');
                  formikProps.handleChange(e);
                }}
                type="password"
                value={formikProps.values.contraseña}
                variant="outlined"
              />
            </div>
            <Box mt={1}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {formikProps.isSubmitting && <LinearProgress />}
                </Grid>
                <Grid item xs={12}>
                  <Box width="100%">
                    <Button
                      color="primary"
                      disabled={formikProps.isSubmitting || status !== ''}
                      fullWidth
                      type="submit"
                      variant="contained"
                    >
                      Ingresar
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default LoginForm;
