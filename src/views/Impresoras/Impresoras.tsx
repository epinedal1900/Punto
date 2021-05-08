/* eslint-disable react/jsx-key */
/* eslint-disable promise/always-return */
/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { useSelector, useDispatch } from 'react-redux';
import CardContent from '@material-ui/core/CardContent';
import { Formik, Field } from 'formik';
import * as yup from 'yup';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import { RadioGroup } from 'formik-material-ui';

import { AuthGuard, Header, SuccessErrorMessage } from '../../components';
import { modificarImpresora } from '../../actions/sessionActions';
import crearTicketData from '../../utils/crearTicketData';

const { ipcRenderer, remote } = window.require('electron');
const { PosPrinter } = remote.require('electron-pos-printer');
const webContents = remote.getCurrentWebContents();
const printers = webContents.getPrinters();
// const remote = electron.remote
const validationSchema = yup.object({
  impresora: yup.string().required('requerido'),
  ancho: yup.string().required('requerido'),
});

const Impresoras = () => {
  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState(null);
  const [reimprimirDisabled, setReimprimirDisabled] = useState(null);
  const session = useSelector((state) => state.session);
  const dispatch = useDispatch();

  const initialValues = {
    impresora: session.impresora,
    ancho: session.ancho,
  };

  const handleSubmit = async (values) => {
    dispatch(
      modificarImpresora({
        impresora: values.impresora,
        ancho: values.ancho,
      })
    );
    localStorage.setItem('impresora', values.impresora);
    localStorage.setItem('ancho', values.ancho);
    setSuccess(true);
    setMessage('Impresora guardada');
  };

  const handleImpresionDePrueba = async (values) => {
    setReimprimirDisabled(true);
    const detalles = [
      { articulo: 'Leggins', cantidad: 100, precio: 100 },
      { articulo: 'Nicker dama basic', cantidad: 100, precio: 100 },
      { articulo: 'Camisola', cantidad: 100, precio: 100 },
      { articulo: 'Short dama basic', cantidad: 100, precio: 100 },
      { articulo: 'Overol corto short dama', cantidad: 100, precio: 100 },
      { articulo: 'Pantalón dama premium', cantidad: 100, precio: 100 },
    ];
    const data = crearTicketData(
      `${session.infoPunto}IMPRESIÓN DE PRUEBA<br>`,
      detalles,
      null,
      100000,
      100
    );
    if (values.ancho && values.impresora) {
      ipcRenderer.send('PRINT', {
        data,
        impresora: values.impresora,
        ancho: values.ancho,
      });
    } else {
      // eslint-disable-next-line no-alert
      alert('seleccione una impresora y un ancho');
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setReimprimirDisabled(false);
  };

  const handleExit = () => {
    setSuccess(null);
    setMessage(null);
  };

  return (
    <AuthGuard denyReadOnly roles={['ADMIN', 'PUNTO']}>
      <Header categoria="Ventas" titulo="Impresoras" />
      <Box display="flex" justifyContent="center" m={0}>
        <Formik
          initialValues={initialValues}
          validateOnBlur={false}
          validateOnChange={false}
          validationSchema={validationSchema}
        >
          {({ isSubmitting, values }) => (
            <Box minHeight={500} width={800}>
              <Card>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="h6">Impresora</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Field component={RadioGroup} name="impresora">
                            {printers.map((val) => (
                              <FormControlLabel
                                control={<Radio disabled={isSubmitting} />}
                                disabled={isSubmitting}
                                label={val.name}
                                value={val.name}
                              />
                            ))}
                          </Field>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="h6">Ancho dd</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Field component={RadioGroup} name="ancho">
                            {['140px', '170px', '200px', '250px', '300px'].map(
                              (val) => (
                                <FormControlLabel
                                  control={<Radio disabled={isSubmitting} />}
                                  disabled={isSubmitting}
                                  label={val}
                                  value={val}
                                />
                              )
                            )}
                          </Field>
                          {/* <h2>{JSON.stringify(values)}</h2> */}
                        </Grid>
                      </Grid>
                      <Box
                        bm={2}
                        display="flex"
                        flexDirection="row-reverse"
                        m={1}
                        p={1}
                      >
                        <Button
                          color="primary"
                          disabled={isSubmitting}
                          onClick={() => handleSubmit(values)}
                          variant="contained"
                        >
                          Guardar
                        </Button>
                        <Box mr={1}>
                          <Button
                            color="primary"
                            disabled={reimprimirDisabled}
                            onClick={() => handleImpresionDePrueba(values)}
                            variant="outlined"
                          >
                            Impresión de prueba
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                    <SuccessErrorMessage
                      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                      handleExit={handleExit}
                      message={message}
                      success={success}
                    />
                  </form>
                </CardContent>
              </Card>
            </Box>
          )}
        </Formik>
      </Box>
    </AuthGuard>
  );
};

export default Impresoras;
