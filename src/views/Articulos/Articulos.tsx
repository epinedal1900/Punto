import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { PRODUCTOS } from '../../utils/queries';
import { AuthGuard, DataTable } from '../../components';

const { ipcRenderer } = window.require('electron');

const Articulos = () => {
  const session = useSelector((state) => state.session);
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState(null);
  useQuery(PRODUCTOS, {
    variables: { _idProductos: 'productos' },
    onCompleted: (data) => {
      ipcRenderer.send('PRODUCTOS', data.productos.objects);
      setProductos(data.productos.objects);
      setLoading(false);
    },
    skip: !session.online,
  });
  useEffect(() => {
    if (!session.online) {
      setProductos(ipcRenderer.sendSync('STORE').productos);
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
            rawData={productos}
            title="Artículos"
          />
        </Grid>
      </Grid>
    </AuthGuard>
  );
};

export default Articulos;
