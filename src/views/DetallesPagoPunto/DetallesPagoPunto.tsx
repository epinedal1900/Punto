/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { useQuery, useMutation } from '@apollo/client';
import omit from 'lodash/omit';
import assign from 'lodash/assign';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { RxDatabase, RxDocument } from 'rxdb';
import { RouteComponentProps, useHistory } from 'react-router-dom';

import {
  Header,
  DetailsTable,
  AuthGuard,
  CancelDialog,
  SuccessErrorMessage,
} from '../../components';

import { PLAZA } from '../../utils/queries';

import {
  plaza,
  plazaVariables,
  plaza_plaza,
  cancelarPago,
  cancelarPagoVariables,
} from '../../types/apollo';
import {
  aFormatoDeDinero,
  obtenerDB,
  obtenerDocsPrincipal,
  obtenerPlazaSinConexion,
} from '../../utils/functions';
import { Info } from '../../types/types';
import * as Database from '../../Database';
import { RootState } from '../../types/store';
import { CANCELAR_PAGO } from '../../utils/mutations';

const DetallesPagoPunto = (
  props: RouteComponentProps<{ puntoId: string; id: string }>
): JSX.Element => {
  const { match } = props;
  const { puntoId, id } = match.params;
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<Info[]>([]);
  const [cancelada, setCancelada] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [db, setDb] = useState<RxDatabase<Database.db> | null>(null);
  const [plazaData, setPlazaData] = useState<plaza | null>(null);
  const [cancelButton, setCancelButton] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [nombre, setNombre] = useState('');

  const session = useSelector((state: RootState) => state.session);
  const plazaState = useSelector((state: RootState) => state.plaza);

  const [plazaDoc, setPlazaDoc] = useState<RxDocument<Database.plazaDB> | null>(
    null
  );
  const [mutationVariablesDoc, setMutationVariablesDoc] = useState<RxDocument<
    Database.mutation_variables
  > | null>(null);
  const [cancelarSinConexionLoading, setCancelarSinConexionLoading] = useState(
    false
  );
  const history = useHistory();

  useQuery<plaza, plazaVariables>(PLAZA, {
    variables: { _id: puntoId },
    skip: !plazaState.online,
    onCompleted: (data) => {
      setPlazaData(data);
    },
  });
  const [cancelarPagoFunction, { loading: cancelLoading }] = useMutation<
    cancelarPago,
    cancelarPagoVariables
  >(CANCELAR_PAGO, {
    onCompleted: (data) => {
      if (data.cancelarPago.success === true) {
        setMessage(data.cancelarPago.message);
        setSuccess(true);
        setCancelOpen(false);
        setCancelButton(false);
        setCancelada(true);
      } else {
        setMessage(data.cancelarPago.message);
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
      if (plazaObj?.ventas) {
        const pago = plazaObj.pagos.find((v) => {
          return v._id === id;
        });
        if (pago) {
          setCancelada(Boolean(pago.ca));
          const infoObj = omit(pago, '_id', 'ca', 'cliente');
          if (
            ((dayjs().diff(dayjs(pago.Fecha), 'day', true) <= 7 &&
              plazaState._idPunto === puntoId) ||
              (session.roles && session.roles[0].role === 'ADMIN')) &&
            !pago.ca &&
            (plazaState.online ||
              (!plazaState.online && pago.Nombre?.includes('sin conexión')))
          ) {
            setCancelButton(true);
          }
          setNombre(pago.Nombre.replace('sin conexión:', ''));
          assign(infoObj, {
            Monto: aFormatoDeDinero(pago.Monto),
            Fecha: dayjs(pago.Fecha).format('DD/MM/YYYY-HH:mm'),
          });
          setInfo(
            Object.entries(infoObj).map(([key, value]) => ({
              key,
              value,
            }))
          );
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
    if (plazaState.online) {
      cancelarPagoFunction({
        variables: {
          _idPago: id,
          nombre,
        },
      });
    } else if (plazaDoc && mutationVariablesDoc) {
      setCancelarSinConexionLoading(true);
      await plazaDoc.atomicUpdate((o) => {
        const i = o.pagos?.findIndex((v) => {
          return v._id === id;
        });
        o.pagos[i].ca = true;
        return o;
      });
      await mutationVariablesDoc.atomicUpdate((o) => {
        const i = o.pago?.findIndex((v) => {
          return v._id === id;
        });
        o.pago.splice(i, 1);
        return o;
      });
      setMessage('Pago cancelado');
      setSuccess(true);
      setCancelOpen(false);
      setCancelButton(false);
      setCancelada(true);
      setCancelarSinConexionLoading(false);
    } else {
      setMessage('Ocurrió un error al cancelar el pago');
    }
  };

  return (
    <AuthGuard roles={['ADMIN', 'PLAZA']}>
      <Header cancelado={cancelada} titulo="Pago" />
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
        message="¿Está seguro de que desea cancelar este pago?"
        open={cancelOpen}
      />
      <Grid container spacing={3}>
        <Grid item lg={4} md={4} xl={3} xs={12}>
          <DetailsTable
            data={info}
            handleCancelClick={cancelButton ? handleCancelClick : undefined}
            hasHeaderColumns={false}
            loading={loading}
            movimiento="pago"
            readOnlyRoles={['PLAZA', 'ADMIN']}
            title="Información general"
          />
        </Grid>
      </Grid>
    </AuthGuard>
  );
};

export default DetallesPagoPunto;
