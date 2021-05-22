import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { omit } from 'lodash';
import {
  Movimientos,
  MovimientosVariables,
  Movimientos_movimientos_movimientos,
} from '../../types/apollo';
import { RootState } from '../../types/store';
import { Session } from '../../types/types';
import { AuthGuard, DataTable, Header } from '../../components';
import { MOVIMIENTOS } from '../../utils/queries';

const { ipcRenderer } = window.require('electron');

const MovimientosComponent = (): JSX.Element => {
  const [loading, setLoading] = useState(true);
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [fecha, setFecha] = useState('...');
  const session: Session = useSelector((state: RootState) => state.session);
  // alert(JSON.stringify(session.tickets));
  useQuery<Movimientos, MovimientosVariables>(MOVIMIENTOS, {
    skip: !session.online,
    variables: { _id: session.puntoIdActivo },
    onCompleted: (data) => {
      if (data.movimientos) {
        ipcRenderer.send('PLAZA', data.movimientos);
        setFecha(data.movimientos.fecha);
        setMovimientos(
          data.movimientos.movimientos.map((val) => {
            return omit(val, 'articulos', 'comentarios', 'Pago');
          })
        );
      }
      setLoading(false);
    },
    fetchPolicy: 'network-only',
  });
  useEffect(() => {
    if (!session.online) {
      const store = ipcRenderer.sendSync('STORE');
      setFecha(store.plaza.fecha);
      let movimientosArr = store.plaza.movimientos.map(
        (val: Movimientos_movimientos_movimientos) => {
          return omit(val, 'articulos', 'comentarios', 'Pago');
        }
      );
      if (store.movimientosOffline) {
        movimientosArr = movimientosArr.concat(
          store.movimientosOffline.map(
            (val: Movimientos_movimientos_movimientos) => {
              return omit(val, 'articulos', 'comentarios', 'Pago');
            }
          )
        );
      }
      setMovimientos(movimientosArr);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.online]);

  return (
    <AuthGuard roles={['ADMIN', 'PUNTO']}>
      <Header titulo={`Plaza: ${fecha}`} />
      {/* <h2>{JSON.stringify(session.tickets)}</h2> */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <DataTable
            detailsPath="/movimientos"
            firstRowId={false}
            loading={loading}
            rawData={movimientos}
            title="Movimientos"
          />
        </Grid>
      </Grid>
    </AuthGuard>
  );
};

export default MovimientosComponent;
