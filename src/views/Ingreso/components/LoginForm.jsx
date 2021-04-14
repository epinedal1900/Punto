/* eslint-disable no-restricted-globals */
/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
/* eslint-disable promise/no-nesting */
/* eslint-disable promise/always-return */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, TextField, Grid, Typography } from '@material-ui/core';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';


import LinearProgress from '@material-ui/core/LinearProgress';
import { useLazyQuery } from '@apollo/client';
import { USUARIO } from '../../../utils/queries';
import { login } from '../../../actions';

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
  const session = useSelector((state) => state.session);
  const [getUser, { loading }] = useLazyQuery(USUARIO);
  const history = useHistory();
  const dispatch = useDispatch()


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
            .then(async (user) => {
              if (user) {
                await getUser({ variables: { uid: user.uid } }).then(
                  (data) => {
                    if (data.usuario !== null) {
                      localStorage.setItem('loggedIn', 'true')
                      localStorage.setItem('roles', JSON.stringify(data.usuario.roles))
                      localStorage.setItem('nombre', data.data.usuario.nombre)
                      dispatch(login({
                        uid: data.usuario._id,
                        nombre: data.usuario.nombre,
                        roles: JSON.stringify(data.usuario.roles),
                      }));
                      // history.push('/')
                    }
                  })
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
                  {(formikProps.isSubmitting || loading) && <LinearProgress />}
                </Grid>
                <Grid item xs={12}>
                  <Box width="100%">
                    <Button
                      color="primary"
                      disabled={
                        formikProps.isSubmitting || status !== '' || loading
                      }
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
