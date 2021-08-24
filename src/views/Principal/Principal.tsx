/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-cycle */
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
  Box,
} from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Formik } from 'formik';
import { useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { RxDatabase, RxDocument } from 'rxdb';
import { useHistory } from 'react-router';

import { NombreTickets, PrincipalValues } from '../../types/types';
import {
  NuevaVentaUtils,
  NuevaVentaUtils_clientes,
  NuevaVentaUtils_puntosActivos_plazasConInventarios,
  Productos_productos_productos,
} from '../../types/apollo';
import { NUEVA_VENTA_UTILS } from '../../utils/queries';
import UpperButtons from './components/UpperButtons';
import LowerButtons from './components/LowerButtons';
import Tickets from './components/Tickets';
import SuccessErrorMessage from '../../components/SuccessErrorMessage';
import CancelDialog from '../../components/CancelDialog';
import AsignarForm from './components/AsignarForm';
import PagoForm from './components/PagoForm';
import CobrarForm from './components/CobrarForm';
import IntercambioForm from './components/IntercambioForm';
import Reporte from './components/Reporte';
import GastoForm from './components/GastoForm';
import AuthGuard from '../../components/AuthGuard';
import {
  actualizarPrincipalEffect,
  eliminarTicket,
  obtenerDB,
  obtenerDocsPrincipal,
  obtenerNombresTickets,
  obtenerPrincipalSinConexion,
} from '../../utils/functions';
import * as Database from '../../Database';
import { articulosEscanerPreciosValidation } from '../../utils/commonValidation';
import { RootState } from '../../types/store';
import { PrincipalInitialValues } from '../../utils/Constants';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    margin: 'none',
  },
  flexGrow: {
    flexGrow: 1,
  },
  container: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
  },
  content: {
    overflowY: 'auto',
    flex: '1 1 auto',
  },
  cardContent: {
    padding: 0,
    '@media (min-height: 800px)': {
      height: '100%',
    },
  },
  cardActions: {
    padding: 0,
  },
  rootBar: {
    boxShadow: 'none',
  },
}));

const validationSchema = yup.object({
  ...articulosEscanerPreciosValidation,
  cliente: yup.object(),
  cantidadPagada: yup.number(),
  intercambioValues: yup.object().shape({
    ...articulosEscanerPreciosValidation,
    plazaReceptora: yup.object().required('requerido').typeError('requerido'),
    tipoDeImpresion: yup.string().oneOf(['imprimir', 'noImprimir']),
  }),
});

const Principal = (): JSX.Element => {
  const classes = useStyles();
  const history = useHistory();
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [eliminarTicketConfirmation, setEliminarTicketConfirmation] = useState(
    false
  );
  const [generarReporteConfirmation, setGenerarReporteConfirmation] = useState(
    false
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [agregarOpen, setAgregarOpen] = useState(false);
  const [pagoOpen, setPagoOpen] = useState(false);
  const [asignarOpen, setAsignarOpen] = useState(false);
  const [cobrarOpen, setCobrarOpen] = useState(false);
  const [intercambioOpen, setIntercambioOpen] = useState(false);
  const [total, setTotal] = useState<number>(0);
  const [opcionesArticulos, setOpcionesArticulos] = useState<
    Productos_productos_productos[]
  >([]);
  const [clientes, setClientes] = useState<NuevaVentaUtils_clientes[]>([]);
  const [gastoOpen, setGastoOpen] = useState(false);
  const plazaState = useSelector((state: RootState) => state.plaza);
  const session = useSelector((state: RootState) => state.session);
  const [db, setDb] = useState<RxDatabase<Database.db> | null>(null);
  const [plazaDoc, setPlazaDoc] = useState<RxDocument<Database.plazaDB> | null>(
    null
  );
  const [mutationVariablesDoc, setMutationVariablesDoc] = useState<RxDocument<
    Database.mutation_variables
  > | null>(null);
  const [loading, setLoading] = useState(false);
  const [plazasParaIntercambios, setPlazasParaIntercambios] = useState<
    NuevaVentaUtils_puntosActivos_plazasConInventarios[]
  >([]);
  const [codigoStr, setCodigoStr] = useState('');
  const [docTicket, setDocTicket] = useState<RxDocument<
    Database.TicketDb
  > | null>(null);
  const [nombresTickets, setNombresTickets] = useState<NombreTickets[]>([
    { _id: 'Ticket 1', nombre: null },
  ]);
  const [docIntercambio, setDocIntercambio] = useState<RxDocument<
    Database.intercambioDB | Database.registroInventarioDB
  > | null>(null);

  useQuery<NuevaVentaUtils>(NUEVA_VENTA_UTILS, {
    onCompleted: (data) => {
      setPlazasParaIntercambios(
        data.puntosActivos?.plazasConInventarios?.filter((v) => {
          return (
            v.id &&
            (v.nombre === 'principal' ||
              (session.nombre === 'Pasillo 6' && v.nombre === 'Pasillo 2') ||
              (session.nombre === 'Pasillo 2' && v.nombre === 'Pasillo 6'))
          );
        }) || []
      );
      setOpcionesArticulos(data.productos?.productos || []);
      setClientes(data.clientes || []);
      setLoading(false);
    },
    skip: !plazaState.online,
  });

  useEffect(() => {
    obtenerDB(db, setDb);
  }, []);

  useEffect(() => {
    obtenerDocsPrincipal(
      db,
      session,
      plazaState,
      setMutationVariablesDoc,
      setPlazaDoc,
      setDocIntercambio
    );
    obtenerNombresTickets(db, setNombresTickets, history);
  }, [db]);

  useEffect(() => {
    if (plazaState.online && !loading) {
      actualizarPrincipalEffect(
        db,
        opcionesArticulos,
        clientes,
        plazasParaIntercambios
      );
    }
  }, [opcionesArticulos, loading]);

  useEffect(() => {
    if (!plazaState.online) {
      obtenerPrincipalSinConexion(
        db,
        setOpcionesArticulos,
        setClientes,
        setPlazasParaIntercambios
      );
    }
  }, [db]);

  useEffect(() => {
    //! repetido en registro de inventario para captar codigo qr
    let str = '';
    const kep = (e: KeyboardEvent) => {
      // TODO actualizar para responder a version con \ al inicio
      // const active = document.activeElement;
      // if (e.key==='\') {
      //   // @ts-expect-error:error
      //   active?.blur();
      // }
      if (e.key !== 'Control' && e.key !== 'Alt' && e.key !== 'Tab') {
        str += e.key.replace('Shift', '');
        if (e.key.includes('Enter')) {
          console.log('str', str);
          setCodigoStr(str);
          str = '';
        }
      } else {
        str = '';
      }
    };
    document.addEventListener('keydown', kep, false);
  }, []);

  const handleExit = () => {
    setSuccess(false);
    setMessage(null);
  };
  const handleEliminarTicketClose = () => {
    setDialogOpen(false);
    setEliminarTicketConfirmation(false);
  };
  const handleEliminarTicket = async () => {
    const selectedTicket =
      nombresTickets.findIndex((v) => {
        return v._id === history.location.search;
      }) || 0;

    const nuevoSelectedTicket =
      selectedTicket === nombresTickets.length - 1
        ? selectedTicket - 1
        : selectedTicket;

    const nuevosTickets: NombreTickets[] = JSON.parse(
      JSON.stringify(nombresTickets)
    ).filter((_v: any, i: number) => {
      return i !== selectedTicket;
    });

    setNombresTickets(nuevosTickets);
    setDialogOpen(false);
    setEliminarTicketConfirmation(false);
    if (docTicket) {
      await eliminarTicket(docTicket);
    }
    history.replace(nuevosTickets[nuevoSelectedTicket]._id);
  };

  const handleGenerarReporteClose = () => {
    setDialogOpen(false);
    setGenerarReporteConfirmation(false);
  };
  const handleAgregarClose = () => {
    setAgregarOpen(false);
    setDialogOpen(false);
  };

  return (
    <AuthGuard roles={['ADMIN', 'PUNTO']}>
      {mutationVariablesDoc && db && plazaDoc && docIntercambio ? (
        <>
          <SuccessErrorMessage
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            handleExit={handleExit}
            message={message}
            success={success}
          />
          <Formik<PrincipalValues>
            initialValues={PrincipalInitialValues}
            onSubmit={() => {}}
            validateOnBlur={false}
            validateOnChange={false}
            validationSchema={validationSchema}
          >
            {(formikProps) => (
              <div className={classes.root}>
                <Reporte
                  handleClose={handleGenerarReporteClose}
                  open={generarReporteConfirmation}
                  setDialogOpen={setDialogOpen}
                  setGenerarReporteConfirmation={setGenerarReporteConfirmation}
                  setMessage={setMessage}
                  setSuccess={setSuccess}
                />
                <CancelDialog
                  handleCancel={() => handleEliminarTicket()}
                  handleClose={handleEliminarTicketClose}
                  message="¿Está seguro de que desea eliminar el ticket?"
                  open={eliminarTicketConfirmation}
                />
                <GastoForm
                  mutationVariablesDoc={mutationVariablesDoc}
                  open={gastoOpen}
                  plazaDoc={plazaDoc}
                  setDialogOpen={setDialogOpen}
                  setGastoOpen={setGastoOpen}
                  setMessage={setMessage}
                  setSuccess={setSuccess}
                />
                <IntercambioForm
                  codigoStr={codigoStr}
                  docIntercambio={docIntercambio}
                  mutationVariablesDoc={mutationVariablesDoc}
                  opcionesArticulos={opcionesArticulos || []}
                  open={intercambioOpen}
                  plazaDoc={plazaDoc}
                  plazasParaIntercambios={plazasParaIntercambios}
                  setCodigoStr={setCodigoStr}
                  setDialogOpen={setDialogOpen}
                  setIntercambioOpen={setIntercambioOpen}
                  setMessage={setMessage}
                  setSuccess={setSuccess}
                />
                <PagoForm
                  clientes={clientes}
                  mutationVariablesDoc={mutationVariablesDoc}
                  open={pagoOpen}
                  plazaDoc={plazaDoc}
                  setDialogOpen={setDialogOpen}
                  setMessage={setMessage}
                  setPagoOpen={setPagoOpen}
                  setSuccess={setSuccess}
                />
                <AsignarForm
                  clientes={clientes}
                  docTicket={docTicket}
                  open={asignarOpen}
                  setAsignarOpen={setAsignarOpen}
                  setDialogOpen={setDialogOpen}
                />
                <CobrarForm
                  docTicket={docTicket}
                  mutationVariablesDoc={mutationVariablesDoc}
                  open={cobrarOpen}
                  plazaDoc={plazaDoc}
                  setCobrarOpen={setCobrarOpen}
                  setDialogOpen={setDialogOpen}
                  setMessage={setMessage}
                  setSuccess={setSuccess}
                />
                <Box height="90vh">
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Paper elevation={2}>
                        <UpperButtons
                          dialogOpen={dialogOpen}
                          docTicket={docTicket}
                          nombresTickets={nombresTickets}
                          productos={opcionesArticulos}
                          setAgregarOpen={setAgregarOpen}
                          setDialogOpen={setDialogOpen}
                          setGastoOpen={setGastoOpen}
                          setGenerarReporteConfirmation={
                            setGenerarReporteConfirmation
                          }
                          setIntercambioOpen={setIntercambioOpen}
                          setNombresTickets={setNombresTickets}
                        />
                      </Paper>
                    </Grid>
                    <Grid item xs={12}>
                      <Card elevation={2}>
                        <CardContent className={classes.cardContent}>
                          <Tickets
                            agregarFormProps={{
                              productos: opcionesArticulos,
                              handleAgregarClose,
                              agregarOpen,
                              docTicket,
                              setAgregarOpen,
                              setDialogOpen,
                            }}
                            codigoStr={codigoStr}
                            db={db}
                            docIntercambio={docIntercambio}
                            docTicket={docTicket}
                            formikProps={formikProps}
                            intercambioOpen={intercambioOpen}
                            nombresTickets={nombresTickets}
                            opcionesArticulos={opcionesArticulos}
                            setCodigoStr={setCodigoStr}
                            setDocTicket={setDocTicket}
                            setNombresTickets={setNombresTickets}
                            setTotal={setTotal}
                          />
                        </CardContent>
                        <CardActions className={classes.cardActions}>
                          <LowerButtons
                            dialogOpen={dialogOpen}
                            docTicket={docTicket}
                            formikProps={formikProps}
                            nombresTickets={nombresTickets}
                            setAsignarOpen={setAsignarOpen}
                            setCobrarOpen={setCobrarOpen}
                            setDialogOpen={setDialogOpen}
                            setEliminarTicketConfirmation={
                              setEliminarTicketConfirmation
                            }
                            setPagoOpen={setPagoOpen}
                            total={total || 0}
                          />
                        </CardActions>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              </div>
            )}
          </Formik>
        </>
      ) : (
        <LinearProgress />
      )}
    </AuthGuard>
  );
};

export default Principal;
