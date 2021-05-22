import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { AuthGuard, DataTable } from '../../components';
import { PRODUCTOS } from '../../utils/queries';
import { RootState } from '../../types/store';
import { Session } from '../../types/types';
import { Articulos as ArticulosType } from '../../types/graphql';
import { Productos, ProductosVariables } from '../../types/apollo';

const { ipcRenderer } = window.require('electron');

const Articulos = (): JSX.Element => {
  const session: Session = useSelector((state: RootState) => state.session);
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState<
    Exclude<ArticulosType, 'cantidad'>[] | null
  >([]);
  useQuery<Productos, ProductosVariables>(PRODUCTOS, {
    variables: { _idProductos: 'productos' },
    onCompleted: (data) => {
      if (data.productos) {
        ipcRenderer.send('PRODUCTOS', data.productos.objects);
        setProductos(data.productos.objects);
      }
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
