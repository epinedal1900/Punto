/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { useQuery, useMutation } from '@apollo/client';
import omit from 'lodash/omit';
import assign from 'lodash/assign';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { RxDatabase, RxDocument } from 'rxdb';
import {
  Header,
  DetailsTable,
  AuthGuard,
  CancelDialog,
  SuccessErrorMessage,
} from '../../components';

import { PLAZA } from '../../utils/queries';
import { CANCELAR_INTERCAMBIO } from '../../utils/mutations';
import { RootState } from '../../types/store';
import * as Database from '../../Database';
import {
  DatosTablaPrendas,
  ImpresionDeTicketsSinPreciosArgs,
  Info,
  PrendasRevision,
} from '../../types/types';
import {
  cancelarIntercambio,
  cancelarIntercambioVariables,
  plaza,
  plazaVariables,
  plaza_plaza,
} from '../../types/apollo';
import {
  crearTicketSinPrecioData,
  datosParaTablaDePrendas,
  intercambioArAPrendasRevision,
  obtenerDB,
  obtenerDocsPrincipal,
  obtenerPlazaSinConexion,
} from '../../utils/functions';

const { ipcRenderer } = window.require('electron');

const DetallesVentaPlaza = (
  props: RouteComponentProps<{ puntoId: string; id: string }>
): JSX.Element => {
  const { match } = props;
  const { puntoId, id } = match.params;
  const session = useSelector((state: RootState) => state.session);
  const plazaState = useSelector((state: RootState) => state.plaza);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<Info[]>([]);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [detalles, setDetalles] = useState<DatosTablaPrendas[]>([]);
  const [reimprimirDisabled, setReimprimirDisabled] = useState(false);
  const [discrepancias, setDiscrepancias] = useState<
    DatosTablaPrendas[] | null
  >(null);
  const [cancelButton, setCancelButton] = useState(false);
  // const [crearDiscrepanciaButton, setCrearDiscrepanciaButton] = useState(false);
  const [cancelada, setCancelada] = useState(false);
  const history = useHistory();
  const [db, setDb] = useState<RxDatabase<Database.db> | null>(null);
  const [plazaData, setPlazaData] = useState<plaza | null>(null);
  const [fecha, setFecha] = useState('');

  const [plazaDoc, setPlazaDoc] = useState<RxDocument<Database.plazaDB> | null>(
    null
  );
  const [mutationVariablesDoc, setMutationVariablesDoc] = useState<RxDocument<
    Database.mutation_variables
  > | null>(null);
  const [cancelarSinConexionLoading, setCancelarSinConexionLoading] = useState(
    false
  );
  const [datosImpresion, setDatosImpresion] = useState<
    PrendasRevision[] | null
  >(null);
  useQuery<plaza, plazaVariables>(PLAZA, {
    variables: { _id: puntoId },
    skip: !plazaState.online,
    onCompleted: (data) => {
      setPlazaData(data);
    },
    onError: () => {
      history.push('/error/405');
    },
  });
  const [cancelarIntercambioFunction, { loading: cancelLoading }] = useMutation<
    cancelarIntercambio,
    cancelarIntercambioVariables
  >(CANCELAR_INTERCAMBIO, {
    onCompleted: (data) => {
      if (data.cancelarIntercambio.success === true) {
        setMessage(data.cancelarIntercambio.message);
        setSuccess(true);
        setCancelOpen(false);
        setCancelButton(false);
        setCancelada(true);
      } else {
        setMessage(data.cancelarIntercambio.message);
      }
    },
    onError: (error) => {
      setMessage(JSON.stringify(error, null, 4));
    },
    refetchQueries: [
      {
        query: PLAZA,
        variables: { _id: puntoId },
      },
    ],
  });
  // const [
  //   nuevaDiscrepanciaEnIntercambioFunction,
  //   { loading: nuevaDiscrepanciaEnIntercambioLoading }
  // ] = useMutation<
  //   nuevaDiscrepanciaEnIntercambio,
  //   nuevaDiscrepanciaEnIntercambioVariables
  // >(NUEVA_DISCREPANCIA_EN_INTERCAMBIO, {
  //   onCompleted: data => {
  //     if (data.nuevaDiscrepanciaEnIntercambio.success === true) {
  //       setMessage(data.nuevaDiscrepanciaEnIntercambio.message);
  //       setSuccess(true);
  //     } else {
  //       setMessage(data.nuevaDiscrepanciaEnIntercambio.message);
  //     }
  //   }
  // });
  useEffect(() => {
    obtenerDB(db, setDb);
  }, []);

  useEffect(() => {
    if (!plazaState.online) {
      obtenerPlazaSinConexion(db, puntoId, setPlazaData);
      obtenerDocsPrincipal(
        db,
        session,
        plazaState,
        setMutationVariablesDoc,
        setPlazaDoc
      );
    }
  }, [db]);

  useEffect(() => {
    const onCompleted = async (plazaObj: plaza_plaza) => {
      if (plazaObj?.intercambios) {
        const intercambio = plazaObj.intercambios.find((v) => {
          return v._id === id;
        });
        if (intercambio) {
          setCancelada(Boolean(intercambio.ca));
          const infoObj = omit(
            intercambio,
            'ar',
            'discrepancias',
            'ca',
            '_id',
            'esEmision'
          );
          assign(infoObj, {
            Fecha: dayjs(intercambio.Fecha).format('DD/MM/YYYY-HH:mm'),
          });
          if (
            ((dayjs().diff(dayjs(intercambio.Fecha), 'day', true) <= 7 &&
              plazaState._idPunto === puntoId) ||
              (session.roles && session.roles[0].role === 'ADMIN')) &&
            intercambio.esEmision &&
            !intercambio.ca &&
            (plazaState.online ||
              (!plazaState.online &&
                intercambio.Envia?.includes('sin conexión')))
          ) {
            setCancelButton(true);
          }
          // if (
          //   ((dayjs().diff(dayjs(intercambio.Fecha), 'day', true) <= 7 &&
          //     plazaState._idPunto === puntoId) ||
          //     (session.roles && session.roles[0].role === 'ADMIN')) &&
          //   !intercambio.esEmision &&
          //   !intercambio.ca &&
          //   !intercambio.discrepancias
          // ) {
          //   setCrearDiscrepanciaButton(true);
          // }
          setInfo(
            Object.entries(infoObj).map(([key, value]) => ({
              key,
              value,
            }))
          );
          setFecha(intercambio.Fecha);
          const dI = await intercambioArAPrendasRevision(intercambio.ar);
          setDatosImpresion(dI);
          const objDetalles = await datosParaTablaDePrendas(intercambio.ar);
          setDetalles(objDetalles);
          if (intercambio.discrepancias) {
            const objDiscrepancias = await datosParaTablaDePrendas(
              intercambio.discrepancias
            );
            setDiscrepancias(objDiscrepancias);
          }
          setLoading(false);
        } else {
          history.push('/error/404');
        }
      }
    };
    if (plazaData?.plaza && plazaData.productos) {
      onCompleted(plazaData.plaza);
    }
  }, [plazaData]);

  const handleExit = () => {
    setSuccess(false);
    setMessage(null);
  };
  const handleCancelClick = () => {
    setCancelOpen(true);
  };
  const handleCancelClose = () => {
    setCancelOpen(false);
  };
  const handleCancel = async () => {
    if (plazaState.online) {
      cancelarIntercambioFunction({
        variables: {
          puntoId,
          _idIntercambio: id,
        },
      });
    } else if (plazaDoc && mutationVariablesDoc) {
      setCancelarSinConexionLoading(true);
      await plazaDoc.atomicUpdate((o) => {
        if (o.intercambios) {
          const i = o.intercambios.findIndex((v) => {
            return v._id === id;
          });
          o.intercambios[i].ca = true;
        }
        return o;
      });
      await mutationVariablesDoc.atomicUpdate((o) => {
        const i = o.intercambio?.findIndex((v) => {
          return v._id === id;
        });
        o.intercambio.splice(i, 1);
        return o;
      });
      setCancelarSinConexionLoading(false);
      setMessage('Intercambio cancelado');
      setSuccess(true);
      setCancelOpen(false);
      setCancelButton(false);
      setCancelada(true);
    } else {
      setMessage('Ocurrió un error al cancelar el intercambio');
    }
  };
  // const handleDiscrepancia = () => {
  //   nuevaDiscrepanciaEnIntercambioFunction({
  //     variables: {
  //       puntoId,
  //       _idIntercambio: id
  //     }
  //   });
  // };

  const handleReimprimir = async () => {
    if (datosImpresion) {
      setReimprimirDisabled(true);
      const ticketArgs: ImpresionDeTicketsSinPreciosArgs = {
        infoPunto: plazaState.infoPunto || 'GIRL STATE <br><br>',
        articulos: datosImpresion,
        fecha,
      };
      const data = crearTicketSinPrecioData(ticketArgs);
      if (plazaState.ancho && plazaState.impresora) {
        ipcRenderer.send('PRINT', {
          data,
          impresora: plazaState.impresora,
          ancho: plazaState.ancho,
        });
      } else {
        // eslint-disable-next-line no-alert
        alert('seleccione una impresora y un ancho');
      }
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setReimprimirDisabled(false);
    }
  };

  return (
    <AuthGuard roles={['ADMIN', 'PLAZA']}>
      <Header
        buttonIcon="imprimir"
        buttonText="Reimprimir ticket"
        cancelado={cancelada}
        categoria="Punto de venta"
        disabled={loading || reimprimirDisabled}
        handleOpen={!cancelada ? handleReimprimir : undefined}
        readOnlyRoles={['ADMIN', 'PLAZA']}
        titulo="Intercambio"
      />
      <SuccessErrorMessage
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        handleExit={handleExit}
        message={message}
        success={success}
      />
      <CancelDialog
        handleCancel={handleCancel}
        handleClose={handleCancelClose}
        loading={cancelLoading || cancelarSinConexionLoading}
        message="¿Está seguro de que desea cancelar este intercambio?"
        open={cancelOpen}
      />
      <Grid container spacing={3}>
        <Grid item lg={4} md={4} xl={3} xs={12}>
          <DetailsTable
            data={info}
            handleCancelClick={cancelButton ? handleCancelClick : undefined}
            hasHeaderColumns={false}
            loading={loading}
            movimiento="intercambio"
            readOnlyRoles={['PLAZA', 'ADMIN']}
            title="Información general"
          />
        </Grid>
        <Grid item lg={8} md={8} xl={3} xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <DetailsTable
                data={detalles}
                hasHeaderColumns
                loading={loading}
                title="Detalles"
                // handleCancelClick={
                //   cancelButton ? handleCancelClick : undefined
                // }
              />
            </Grid>
            {discrepancias && (
              <Grid item xs={12}>
                <DetailsTable
                  data={discrepancias}
                  hasHeaderColumns
                  loading={loading}
                  title="Discrepancias"
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </AuthGuard>
  );
};

export default DetallesVentaPlaza;
