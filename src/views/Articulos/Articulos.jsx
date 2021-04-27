import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Grid } from '@material-ui/core';
import { PRODUCTOS } from '../../utils/queries';
import { AuthGuard, DataTable } from '../../components';

const Articulos = () => {
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState(null);
  useQuery(PRODUCTOS, {
    variables: { _idProductos: 'productos' },
    onCompleted: (data) => {
      setProductos(data.productos.objects);
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
            rawData={productos}
            title="Artículos"
          />
        </Grid>
      </Grid>
    </AuthGuard>
  );
};

export default Articulos;
