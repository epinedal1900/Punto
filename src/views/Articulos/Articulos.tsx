/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { RxDatabase } from 'rxdb';

import { AuthGuard, DataTable } from '../../components';
import { PRODUCTOS } from '../../utils/queries';
import { RootState } from '../../types/store';
import { Productos, Productos_productos_productos } from '../../types/apollo';
import * as Database from '../../Database';
import { obtenerDB, obtenerPrincipalSinConexion } from '../../utils/functions';

const Articulos = (): JSX.Element => {
  const plazaState = useSelector((state: RootState) => state.plaza);
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState<Productos_productos_productos[]>(
    []
  );
  const [productosTabla, setProductosTabla] = useState<any[]>([]);
  const [db, setDb] = useState<RxDatabase<Database.db> | null>(null);
  useQuery<Productos>(PRODUCTOS, {
    variables: { _idProductos: 'productos' },
    onCompleted: (data) => {
      setProductos(data.productos?.productos || []);
    },
    skip: !plazaState.online,
  });

  useEffect(() => {
    obtenerDB(db, setDb);
  }, []);
  useEffect(() => {
    if (productos.length > 0) {
      const pT = productos.map((v) => {
        return { Nombre: v.nombre, Código: v.codigo, Precio: v.precio };
      });
      setProductosTabla(pT);
      setLoading(false);
    }
  }, [productos]);

  useEffect(() => {
    if (!plazaState.online) {
      obtenerPrincipalSinConexion(db, setProductos);
    }
  }, [db]);

  return (
    <AuthGuard roles={['ADMIN', 'PLAZA']}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <DataTable
            firstRowId={false}
            loading={loading}
            rawData={productosTabla}
            title="Artículos"
          />
        </Grid>
      </Grid>
    </AuthGuard>
  );
};

export default Articulos;
