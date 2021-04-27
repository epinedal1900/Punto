import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { omit } from 'lodash';
import { MOVIMIENTOS } from '../../utils/queries';
import { AuthGuard, DataTable, Header } from '../../components';

const Movimientos = () => {
  const [loading, setLoading] = useState(true);
  const [movimientos, setMovimientos] = useState(null);
  const [fecha, setFecha] = useState('...');
  const session = useSelector((state) => state.session);
  useQuery(MOVIMIENTOS, {
    variables: { _id: session.puntoIdActivo },
    onCompleted: (data) => {
      setFecha(data.movimientos.fecha);
      setMovimientos(
        data.movimientos.movimientos.map((val) => {
          return omit(val, 'articulos', 'comentarios');
        })
      );
      setLoading(false);
    },
  });

  return (
    <AuthGuard roles={['ADMIN', 'PUNTO']}>
      <Header categoria="Movimientos" titulo={`Plaza: ${fecha}`} />
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

export default Movimientos;
