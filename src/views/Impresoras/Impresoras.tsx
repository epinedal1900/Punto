/* eslint-disable react/jsx-key */
/* eslint-disable promise/always-return */
/* eslint-disable no-underscore-dangle */
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import { Field, Formik } from 'formik';
import { RadioGroup } from 'formik-material-ui';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { modificarImpresora } from '../../actions';
import { AuthGuard, Header, SuccessErrorMessage } from '../../components';
import { RootState } from '../../types/store';
import { ImpresoraValues } from '../../types/types';
import { crearTicketData } from '../../utils/functions';

const { ipcRenderer, remote } = window.require('electron');
const webContents = remote.getCurrentWebContents();
const printers = webContents.getPrinters();
// const remote = electron.remote
const validationSchema = yup.object({
  impresora: yup.string().required('requerido'),
  ancho: yup.string().required('requerido'),
});

const Impresoras = () => {
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [reimprimirDisabled, setReimprimirDisabled] = useState(false);
  const plaza = useSelector((state: RootState) => state.plaza);
  const dispatch = useDispatch();

  const handleSubmit = async (values: ImpresoraValues) => {
    dispatch(
      modificarImpresora({
        impresora: values.impresora,
        ancho: values.ancho,
      })
    );
    setSuccess(true);
    setMessage('Impresora guardada');
  };

  const handleImpresionDePrueba = async (values: ImpresoraValues) => {
    setReimprimirDisabled(true);
    const detalles = [
      { Nombre: 'Leggins', Cantidad: 100, Precio: 100 },
      { Nombre: 'Nicker dama basic', Cantidad: 100, Precio: 100 },
      { Nombre: 'Camisola', Cantidad: 100, Precio: 100 },
      { Nombre: 'Short dama basic', Cantidad: 100, Precio: 100 },
      { Nombre: 'Overol corto short dama', Cantidad: 100, Precio: 100 },
      { Nombre: 'Pantalón dama premium', Cantidad: 100, Precio: 100 },
    ];
    const data = crearTicketData({
      infoPunto: `${plaza.infoPunto}IMPRESIÓN DE PRUEBA<br>`,
      articulos: detalles,
      cliente: null,
      cantidadPagada: 100000,
      cambio: 100,
    });
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
    setSuccess(false);
    setMessage(null);
  };

  return (
    <AuthGuard denyReadOnly roles={['ADMIN', 'PLAZA']}>
      <Header titulo="Impresoras" />
      <Box display="flex" justifyContent="center" m={0}>
        <Formik<ImpresoraValues>
          initialValues={{
            impresora: plaza.impresora || '',
            ancho: plaza.ancho || '',
          }}
          onSubmit={() => {}}
          validateOnBlur={false}
          validateOnChange={false}
          validationSchema={validationSchema}
        >
          {({ isSubmitting, values }) => (
            <Box minHeight={500} width={800}>
              <Card>
                <CardContent>
                  <form>
                    <Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="h6">Impresora</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Field component={RadioGroup} name="impresora">
                            {printers.map((val: any) => (
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
                          <Typography variant="h6">Ancho</Typography>
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
