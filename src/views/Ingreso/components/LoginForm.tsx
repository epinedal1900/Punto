/* eslint-disable no-alert */
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
import { PLAZA, USUARIO } from '../../../utils/queries';

import { RootState } from '../../../types/store';
import {
  plaza,
  plazaVariables,
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
  const session = useSelector((state: RootState) => state.session);
  const [uid, setUid] = useState<string | null>(null);
  const [idPunto, setidPunto] = useState<string | null>(null);
  const { refetch: getPlaza } = useQuery<plaza, plazaVariables>(PLAZA, {
    variables: { _id: idPunto || '' },
    skip: !idPunto,
  });
  const { refetch: getUser } = useQuery<Usuario, UsuarioVariables>(USUARIO, {
    variables: { uid: uid || '' },
    skip: !uid,
  });

  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (session.loggedIn) {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.loggedIn]);

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
                setUid(res.user.uid);
                await getUser({ uid: res.user.uid }).then((data) => {
                  const { usuario } = data.data;
                  if (usuario) {
                    setidPunto(usuario._idPunto);
                    dispatch({
                      type: 'SESSION_LOGIN',
                      loginArgs: {
                        nombre: usuario.nombre,
                        roles: usuario.roles,
                        uid,
                      },
                    });
                    if (usuario._idPunto && usuario.idInventario) {
                      dispatch({
                        type: 'ASIGNAR_PUNTO',
                        asignarPuntoArgs: {
                          idInventario: usuario.idInventario,
                          _idPunto: usuario._idPunto,
                          _idPuntoPrincipal: usuario._idPuntoPrincipal,
                          infoPunto: usuario.infoPunto,
                          sinAlmacen: usuario.sinAlmacen,
                        },
                      });
                    } else {
                      dispatch({ type: 'DESACTIVAR_PUNTO' });
                      alert('No hay ninguna plaza activa');
                    }
                    history.push('/');
                  }
                });
                getPlaza({ _id: idPunto || '' });
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
