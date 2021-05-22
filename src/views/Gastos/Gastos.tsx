import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { omit } from 'lodash';
import { MOVIMIENTOS } from '../../utils/queries';
import { AuthGuard, DataTable } from '../../components';
import { RootState } from '../../types/store';
import { Session } from '../../types/types';
import {
  Movimientos,
  MovimientosVariables,
  Movimientos_movimientos_gastos,
} from '../../types/apollo';

const { ipcRenderer } = window.require('electron');

const Gastos = () => {
  const [gastos, setGastos] = useState<Movimientos_movimientos_gastos[]>([]);
  const [loading, setLoading] = useState(true);
  const session: Session = useSelector((state: RootState) => state.session);
  useQuery<Movimientos, MovimientosVariables>(MOVIMIENTOS, {
    skip: !session.online,
    variables: { _id: session.puntoIdActivo },
    onCompleted: (data) => {
      if (data.movimientos) {
        ipcRenderer.send('PLAZA', data.movimientos);
        setGastos(data.movimientos.gastos);
      }
      setLoading(false);
    },
  });
  useEffect(() => {
    if (!session.online) {
      const store = ipcRenderer.sendSync('STORE');
      let gastosArr = store.plaza.gastos;
      if (store.gastosOffline) {
        gastosArr = gastosArr.concat(
          store.gastosOffline.map((val: any) => {
            return omit(val, '_id');
          })
        );
      }
      setGastos(gastosArr);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.online]);
  return (
    <AuthGuard roles={['ADMIN', 'PUNTO']}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <DataTable
            firstRowId={false}
            loading={loading}
            rawData={gastos}
            title="Gastos"
          />
        </Grid>
      </Grid>
    </AuthGuard>
  );
};

export default Gastos;
