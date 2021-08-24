/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { useQuery, useMutation } from '@apollo/client';
import omit from 'lodash/omit';
import { pdf } from '@react-pdf/renderer';
import assign from 'lodash/assign';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { RxDatabase, RxDocument } from 'rxdb';
import ObjectID from 'bson-objectid';

import {
  Header,
  DetailsTable,
  AuthGuard,
  CancelDialog,
  SuccessErrorMessage,
} from '../../components';

import { PLAZA } from '../../utils/queries';
import { CANCELAR_VENTA, CANCELAR_VENTA_PUNTO } from '../../utils/mutations';
import { RootState } from '../../types/store';
import * as Database from '../../Database';
import {
  DatosTablaPrendas,
  ImpresionDeTicketsArgs,
  Info,
} from '../../types/types';
import {
  cancelarVenta,
  cancelarVentaPunto,
  cancelarVentaPuntoVariables,
  cancelarVentaVariables,
  plaza,
  plazaVariables,
  plaza_plaza,
} from '../../types/apollo';
import {
  aFormatoDeDinero,
  crearTicketData,
  datosParaTablaDePrendas,
  obtenerDB,
  obtenerDocsPrincipal,
  obtenerPlazaSinConexion,
} from '../../utils/functions';
import Notas from '../Principal/components/Notas';

const { ipcRenderer } = window.require('electron');
const electron = window.require('electron');
const { remote } = electron;
const { BrowserWindow } = remote;

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
  const [cancelButton, setCancelButton] = useState(false);
  const [cancelada, setCancelada] = useState(false);
  const [nombre, setNombre] = useState<string | null>(null);
  const history = useHistory();
  const [db, setDb] = useState<RxDatabase<Database.db> | null>(null);
  const [plazaData, setPlazaData] = useState<plaza | null>(null);
  const [fecha, setFecha] = useState('');
  const [plazaDoc, setPlazaDoc] = useState<RxDocument<Database.plazaDB> | null>(
    null
  );
  const [reimprimirDisabled, setReimprimirDisabled] = useState(false);
  const [mutationVariablesDoc, setMutationVariablesDoc] = useState<RxDocument<
    Database.mutation_variables
  > | null>(null);
  const [cancelarSinConexionLoading, setCancelarSinConexionLoading] = useState(
    false
  );

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
  const [
    cancelarVentaPuntoFunction,
    { loading: cancelarVentaPuntoLoading },
  ] = useMutation<cancelarVentaPunto, cancelarVentaPuntoVariables>(
    CANCELAR_VENTA_PUNTO,
    {
      onCompleted: (data) => {
        if (data.cancelarVentaPunto.success === true) {
          setMessage(data.cancelarVentaPunto.message);
          setSuccess(true);
          setCancelOpen(false);
          setCancelButton(false);
          setCancelada(true);
        } else {
          setMessage(data.cancelarVentaPunto.message);
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
    }
  );

  const [
    cancelarVentaFunction,
    { loading: cancelarVentaLoading },
  ] = useMutation<cancelarVenta, cancelarVentaVariables>(CANCELAR_VENTA, {
    onCompleted: (data) => {
      if (data.cancelarVenta.success === true) {
        setMessage(data.cancelarVenta.message);
        setSuccess(true);
        setCancelOpen(false);
        setCancelButton(false);
        setCancelada(true);
      } else {
        setMessage(data.cancelarVenta.message);
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

  useEffect(() => {
    obtenerDB(db, setDb);
  }, []);

  useEffect(() => {
    if (!plazaState.online) {
      obtenerPlazaSinConexion(db, puntoId, setPlazaData);
    }
    obtenerDocsPrincipal(
      db,
      session,
      plazaState,
      setMutationVariablesDoc,
      setPlazaDoc
    );
  }, [db]);

  useEffect(() => {
    const onCompleted = async (plazaObj: plaza_plaza) => {
      if (plazaObj?.ventas) {
        const venta = plazaObj.ventas.find((v) => {
          return v._id === id;
        });
        if (venta) {
          setFecha(venta.Fecha);
          setCancelada(Boolean(venta.ca));
          const infoObj = omit(venta, 'ar', '_id', 'ca');
          assign(infoObj, {
            Monto: aFormatoDeDinero(venta.Monto),
            Fecha: dayjs(venta.Fecha).format('DD/MM/YYYY-HH:mm'),
          });
          if (
            ((dayjs().diff(dayjs(venta.Fecha), 'day', true) <= 7 &&
              plazaState._idPunto === puntoId) ||
              (session.roles && session.roles[0].role === 'ADMIN')) &&
            !venta.ca &&
            (plazaState.online ||
              (!plazaState.online && venta.Nombre?.includes('sin conexión')))
          ) {
            setCancelButton(true);
          }
          if (!venta.Nombre?.includes('público en general')) {
            setNombre(venta.Nombre);
          }
          setInfo(
            Object.entries(infoObj).map(([key, value]) => ({
              key,
              value,
            }))
          );
          const objDetalles = await datosParaTablaDePrendas(venta.ar);
          setDetalles(objDetalles);
          setLoading(false);
        } else {
          history.push('/error/404');
        }
      } else {
        history.push('/error/404');
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
    let mutationVariablesEliminada = false;
    setCancelarSinConexionLoading(true);
    if (nombre && plazaState.online) {
      cancelarVentaFunction({
        variables: {
          _idVenta: id,
          nombre,
        },
      });
    } else if (nombre && mutationVariablesDoc) {
      await mutationVariablesDoc.atomicUpdate((o) => {
        const i = o.venta_cliente?.findIndex((v) => {
          return v._id === id;
        });
        o.venta_cliente.splice(i, 1);
        return o;
      });
      mutationVariablesEliminada = true;
    } else if (plazaState.online) {
      cancelarVentaPuntoFunction({
        variables: {
          _idVenta: id,
          puntoId,
        },
      });
    } else if (mutationVariablesDoc) {
      await mutationVariablesDoc.atomicUpdate((o) => {
        const i = o.venta_punto?.findIndex((v) => {
          return v._id === id;
        });
        o.venta_punto.splice(i, 1);
        return o;
      });
      mutationVariablesEliminada = true;
    } else {
      setMessage('Ocurrió un error al cancelar la venta');
    }
    if (mutationVariablesEliminada && plazaDoc) {
      await plazaDoc.atomicUpdate((o) => {
        if (o.ventas) {
          const i = o.ventas.findIndex((v) => {
            return v._id === id;
          });
          o.ventas[i].ca = true;
        }
        return o;
      });
      setMessage('Venta cancelada');
      setSuccess(true);
      setCancelOpen(false);
      setCancelButton(false);
      setCancelada(true);
    }
    setCancelarSinConexionLoading(false);
  };

  const handleReimprimir = async () => {
    setReimprimirDisabled(true);
    const ticketArgs: Required<ImpresionDeTicketsArgs> = {
      infoPunto: plazaState.infoPunto || 'GIRL STATE <br><br>',
      articulos: detalles,
      cliente: nombre,
      cantidadPagada: null,
      cambio: null,
      fecha,
    };
    const data = crearTicketData(ticketArgs);
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
  };
  const handleReimprimirA5 = async () => {
    if (nombre) {
      setReimprimirDisabled(true);
      const doc = (
        <Notas
          articulos={detalles || []}
          fecha={dayjs(new ObjectID(id).getTimestamp())}
          nombre={nombre}
        />
      );
      const blob = await pdf(doc).toBlob();
      const Url = window.URL.createObjectURL(blob);
      const win = new BrowserWindow({ width: 600, height: 800 });
      win.loadURL(Url);
      setReimprimirDisabled(false);
    }
  };
  return (
    <AuthGuard roles={['ADMIN', 'PUNTO']}>
      <Header
        buttonIcon="imprimir"
        buttonSecondaryIcon="imprimir"
        buttonSecondaryText="Imprimir nota A5"
        buttonText="Reimprimir ticket"
        cancelado={cancelada}
        disabled={loading || reimprimirDisabled}
        handleOpen={!cancelada ? handleReimprimir : undefined}
        handleSecondaryOpen={
          nombre && !cancelada ? handleReimprimirA5 : undefined
        }
        readOnlyRoles={['ADMIN', 'PUNTO']}
        titulo="Venta"
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
        loading={
          cancelarVentaLoading ||
          cancelarVentaPuntoLoading ||
          cancelarSinConexionLoading
        }
        message="¿Está seguro de que desea cancelar esta venta?"
        open={cancelOpen}
      />
      <Grid container spacing={3}>
        <Grid item lg={4} md={4} xl={3} xs={12}>
          <DetailsTable
            data={info}
            handleCancelClick={cancelButton ? handleCancelClick : undefined}
            hasHeaderColumns={false}
            loading={loading}
            movimiento="venta"
            readOnlyRoles={['PUNTO', 'ADMIN']}
            title="Información general"
          />
        </Grid>
        <Grid item lg={8} md={8} xl={3} xs={12}>
          <DetailsTable
            data={detalles}
            hasHeaderColumns
            loading={loading}
            readOnlyRoles={['VENTAS', 'ADMIN']}
            title="Detalles"
          />
        </Grid>
      </Grid>
    </AuthGuard>
  );
};

export default DetallesVentaPlaza;
