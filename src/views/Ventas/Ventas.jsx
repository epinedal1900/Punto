import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Grid } from '@material-ui/core';
import { VENTAS } from '../../utils/queries';
import { AuthGuard, DataTable } from '../../components';

const Ventas = () => {
  const [loading, setLoading] = useState(true);
  const [ventas, setVentas] = useState(null);
  useQuery(VENTAS, {
    onCompleted: (data) => {
      setVentas(data.ventas);
      setLoading(false);
    },
  });

  return (
    <AuthGuard roles={['ADMIN', 'PUNTO']}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <DataTable
            detailsPath="/ventas"
            firstRowId={false}
            loading={loading}
            rawData={ventas}
            title="Ventas"
          />
        </Grid>
      </Grid>
    </AuthGuard>
  );
};

export default Ventas;
