import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { MOVIMIENTOS } from '../../utils/queries';
import { AuthGuard, DataTable } from '../../components';

const Gastos = () => {
  const [gastos, setGastos] = useState(null);
  const [loading, setLoading] = useState(true);
  const session = useSelector((state) => state.session);
  useQuery(MOVIMIENTOS, {
    variables: { _id: session.puntoIdActivo },
    onCompleted: (data) => {
      setGastos(data.movimientos.gastos);
      setLoading(false);
    },
  });

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
