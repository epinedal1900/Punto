/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/ban-types */
import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import * as yup from 'yup';
import { useMutation, useQuery } from '@apollo/client';
import {
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  CardHeader,
  Typography,
  Box,
  LinearProgress,
  Button,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useSelector } from 'react-redux';
import { RxDatabase, RxDocument } from 'rxdb';

import { Formik, FormikHelpers } from 'formik';
import { AuthGuard, Header, SuccessErrorMessage } from '../../components';
import { NUEVO_REGISTRO_INVENTARIO_UTILS } from '../../utils/queries';
import { RootState } from '../../types/store';
import {
  Inventario_inventario_inv,
  nuevoRegistroDeInventario,
  nuevoRegistroDeInventarioVariables,
  nuevoRegistroInventarioUtils,
  nuevoRegistroInventarioUtilsVariables,
  PrendasNuevoRegistro,
  Productos_productos_productos,
} from '../../types/apollo';
import {
  obtenerDB,
  obtenerPrincipalSinConexion,
  resolverPrendas,
  restablecerRegistroInventario,
} from '../../utils/functions';
import * as Database from '../../Database';
import { ArticulosValues } from '../../types/types';
import { ArticulosInitialValues } from '../../utils/Constants';
import Steps from './components/Steps';
import { articulosEscanerInventarioValidation } from '../../utils/commonValidation';
import { NUEVO_REGISTRO_DE_INVENTARIO } from '../../utils/mutations';

const NuevoRegistroDeInventario = ({
  history,
}: RouteComponentProps): JSX.Element => {
  const session = useSelector((state: RootState) => state.session);
  const plazaState = useSelector((state: RootState) => state.plaza);

  const [db, setDb] = useState<RxDatabase<Database.db> | null>(null);
  const [docRegistroInventario, setDocRegistroInventario] = useState<RxDocument<
    Database.registroInventarioDB | Database.intercambioDB
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [esperaResumen, setEsperaResumen] = useState(false);
  const [codigoStr, setCodigoStr] = useState('');
  const [productos, setProductos] = useState<Productos_productos_productos[]>(
    []
  );
  const [inventario, setInventario] = useState<
    Inventario_inventario_inv[] | null
  >(null);
  const [prendasPorRegistrar, setPrendasPorRegistrar] = useState<string[]>([]);
  const [discrepancias, setDiscrepancias] = useState<PrendasNuevoRegistro[]>(
    []
  );
  const [prendasIds, setPrendasIds] = useState<string[] | null>(null);
  const [nuevoInventario, setNuevoInventario] = useState<
    PrendasNuevoRegistro[]
  >([]);
  const lastStep = 1;

  useEffect(() => {
    obtenerDB(db, setDb);
    //! repetido en principal para captar codigo qr
    let str = '';
    const kep = (e: KeyboardEvent) => {
      if (e.key !== 'Control' && e.key !== 'Alt' && e.key !== 'Tab') {
        str += e.key.replace('Shift', '');
        if (e.key.includes('Enter')) {
          setCodigoStr(str);
          str = '';
        }
      } else {
        str = '';
      }
    };
    document.addEventListener('keydown', kep, false);
  }, []);
  useEffect(() => {
    if (!plazaState.online) {
      obtenerPrincipalSinConexion(db, setProductos);
    }
  }, [db]);
  useEffect(() => {
    const resolver = async () => {
      await resolverPrendas(prendasIds || []).then((prendas) => {
        const p = [...prendas];
        p.sort((a, b) => {
          return a.nombre.localeCompare(b.nombre);
        });
        setPrendasPorRegistrar(
          p.map((val) => {
            return val.nombre;
          })
        );
        setLoading(false);
      });
    };
    if (prendasIds) {
      resolver();
    }
  }, [prendasIds]);
  useEffect(() => {
    const bloquearSubmit = async () => {
      setEsperaResumen(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setEsperaResumen(false);
    };
    if (activeStep === lastStep) {
      bloquearSubmit();
    } else {
      setEsperaResumen(false);
    }
  }, [activeStep]);

  const [
    nuevoRegistroDeInventarioF,
    { loading: nuevoRegistroDeInventarioLoading },
  ] = useMutation<
    nuevoRegistroDeInventario,
    nuevoRegistroDeInventarioVariables
  >(NUEVO_REGISTRO_DE_INVENTARIO, {
    onCompleted: (data) => {
      if (data.nuevoRegistroDeInventario.success === true) {
        setMessage(data.nuevoRegistroDeInventario.message);
        setSuccess(true);
        setActiveStep(0);
      } else {
        setMessage(data.nuevoRegistroDeInventario.message);
      }
    },
  });

  useQuery<nuevoRegistroInventarioUtils, nuevoRegistroInventarioUtilsVariables>(
    NUEVO_REGISTRO_INVENTARIO_UTILS,
    {
      variables: {
        _id: plazaState.idInventario || '',
      },
      onCompleted: (data) => {
        if (data.productos) setProductos(data.productos.productos || []);
        if (data.inventario?.encrypted) {
          const decripted = CryptoJS.AES.decrypt(
            data.inventario.encrypted,
            session.uid || ''
          ).toString(CryptoJS.enc.Utf8);
          setInventario(JSON.parse(decripted));
          setPrendasIds(data.prendasPorRegistrar);
        } else {
          history.push('/error/405');
        }
      },
      fetchPolicy: 'network-only',
      skip: !plazaState.idInventario || !plazaState.online,
    }
  );

  const onSubmit = async (
    _values: ArticulosValues,
    actions: FormikHelpers<ArticulosValues>
  ) => {
    if (activeStep === lastStep && docRegistroInventario) {
      if (plazaState.idInventario && session.nombre) {
        await nuevoRegistroDeInventarioF({
          variables: {
            articulos: nuevoInventario,
            discrepancias,
            _id: plazaState.idInventario,
            nombre: session.nombre,
          },
        }).then(async (res) => {
          if (res.data && res.data.nuevoRegistroDeInventario.success === true) {
            actions.resetForm();
            await restablecerRegistroInventario(docRegistroInventario);
          }
        });
      }
    } else {
      setActiveStep(activeStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  };

  const handleExit = () => {
    setSuccess(false);
    setMessage(null);
    window.location.reload();
  };
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <AuthGuard denyReadOnly roles={['ADMIN', 'PLAZA']}>
      <Header titulo="Nuevo registro de inventario" />
      <SuccessErrorMessage
        handleExit={handleExit}
        message={message}
        success={success}
      />
      <Box display="flex" justifyContent="center" m={0}>
        <Grid alignContent="center" container justify="center" spacing={3}>
          {plazaState.online && (
            <Grid item xs={2}>
              <Card elevation={4}>
                <CardHeader
                  title={
                    <Typography variant="h6">Prendas por registrar</Typography>
                  }
                />
                <CardContent style={{ padding: 0 }}>
                  {!loading ? (
                    <Box maxHeight="70vh" overflow="auto">
                      <List dense disablePadding>
                        {prendasPorRegistrar.map((prenda, id) => (
                          <ListItem id={`prenda.${id}`}>
                            <Typography color="textSecondary" variant="h6">
                              {prenda}
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  ) : (
                    <Skeleton />
                  )}
                </CardContent>
              </Card>
            </Grid>
          )}
          <Grid item xs={plazaState.online ? 10 : 12}>
            <Formik<ArticulosValues>
              initialValues={ArticulosInitialValues}
              onSubmit={onSubmit}
              validateOnBlur={false}
              validateOnChange={false}
              validationSchema={yup.object(
                articulosEscanerInventarioValidation
              )}
            >
              {({ values, handleSubmit, isSubmitting, isValid }) => (
                <form onSubmit={handleSubmit}>
                  <Card elevation={4}>
                    <CardContent>
                      <Steps
                        activeStep={activeStep}
                        codigoStr={codigoStr}
                        db={db}
                        docRegistroInventario={docRegistroInventario}
                        inventario={inventario}
                        productos={productos}
                        setCodigoStr={setCodigoStr}
                        setDiscrepancias={setDiscrepancias}
                        setDocRegistroInventario={setDocRegistroInventario}
                        setNuevoInventario={setNuevoInventario}
                      />
                      {isSubmitting && (
                        <Box>
                          <LinearProgress />
                        </Box>
                      )}
                      <Box display="flex" flexDirection="row-reverse" mt={1}>
                        <Button
                          color={isValid ? 'primary' : 'default'}
                          disabled={
                            !plazaState.online ||
                            !inventario ||
                            isSubmitting ||
                            esperaResumen ||
                            loading ||
                            (values.escaneos.length === 0 &&
                              values.prendasSueltas.length === 0)
                          }
                          type="submit"
                          variant="contained"
                        >
                          {activeStep === lastStep ? 'Finalizar' : 'Siguiente'}
                        </Button>
                        {activeStep !== 0 && (
                          <Button
                            disabled={
                              isSubmitting || nuevoRegistroDeInventarioLoading
                            }
                            onClick={handleBack}
                          >
                            Atras
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </form>
              )}
            </Formik>
          </Grid>
        </Grid>
      </Box>
    </AuthGuard>
  );
};

export default NuevoRegistroDeInventario;
