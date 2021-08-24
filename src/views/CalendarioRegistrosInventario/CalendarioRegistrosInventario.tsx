/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { useQuery } from '@apollo/client';
import {
  Box,
  List,
  ListItem,
  Card,
  CardContent,
  Typography,
  ListItemText,
  Divider,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { RouteComponentProps } from 'react-router';
import { useSelector } from 'react-redux';
import { RxDatabase } from 'rxdb';

import { CALENDARIO_REGISTROS_INVENTARIO } from '../../utils/queries';
import { Header, AuthGuard, SuccessErrorMessage } from '../../components';
import {
  calendarioRegistrosInventario,
  calendarioRegistrosInventarioVariables,
  calendarioRegistrosInventario_calendarioRegistrosInventario_dias,
} from '../../types/apollo';
import {
  actualizarCalendarioEffect,
  obtenerCalendarioSinConexion,
  obtenerDB,
  procesarDiasCalendario,
} from '../../utils/functions';
import { RootState } from '../../types/store';
import * as Database from '../../Database';

const DetallesPago = ({ history }: RouteComponentProps): JSX.Element => {
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [db, setDb] = useState<RxDatabase<Database.db> | null>(null);
  const [dias, setDias] = useState<
    calendarioRegistrosInventario_calendarioRegistrosInventario_dias[]
  >([]);
  const plazaState = useSelector((state: RootState) => state.plaza);
  useQuery<
    calendarioRegistrosInventario,
    calendarioRegistrosInventarioVariables
  >(CALENDARIO_REGISTROS_INVENTARIO, {
    variables: {
      _id: plazaState.idInventario || '',
    },
    skip: !plazaState.idInventario || !plazaState.online,
    onCompleted: async (data) => {
      if (data.calendarioRegistrosInventario?.dias) {
        const diasArr = await procesarDiasCalendario(
          data.calendarioRegistrosInventario?.dias
        );
        setDias(diasArr);
        setLoading(false);
      } else {
        history.push('/error/404');
      }
    },
  });

  useEffect(() => {
    obtenerDB(db, setDb);
  }, []);

  useEffect(() => {
    if (!plazaState.online) {
      obtenerCalendarioSinConexion(db, setDias, setLoading);
    }
  }, [db]);

  useEffect(() => {
    if (plazaState.online) {
      actualizarCalendarioEffect(db, loading, dias);
    }
  }, [db, loading, dias]);

  const handleExit = () => {
    setMessage(null);
    setSuccess(false);
  };
  return (
    <AuthGuard roles={['ADMIN', 'PUNTO']}>
      <Header titulo="Calendario de registros" />
      <SuccessErrorMessage
        handleExit={handleExit}
        message={message}
        success={success}
      />
      <Box display="flex" justifyContent="center" m={0}>
        <Box minHeight={500} width={450}>
          <Card elevation={4}>
            <CardContent>
              {!loading ? (
                <List>
                  {dias.map((dia) => (
                    <ListItem>
                      <ListItemText
                        primary={
                          <Grid alignItems="center" container spacing={1}>
                            <Grid item xs={12}>
                              <Typography align="center" variant="h5">
                                {dia.fecha}
                              </Typography>
                              <Divider />
                            </Grid>
                            <Grid item xs={12}>
                              {dia.prendas.map((prenda) => (
                                <Grid item xs={12}>
                                  <Typography
                                    color={
                                      prenda.reg ? 'secondary' : 'textSecondary'
                                    }
                                    variant="h6"
                                  >
                                    {prenda.id}
                                  </Typography>
                                </Grid>
                              ))}
                            </Grid>
                          </Grid>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <>
                  {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map(() => (
                    <Skeleton />
                  ))}
                </>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </AuthGuard>
  );
};

export default DetallesPago;
