/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import {
  Grid,
  Typography,
  CardHeader,
  Card,
  CardContent,
  Box,
  Divider,
  Link,
  CardActions,
} from '@material-ui/core';
import { groupBy } from 'lodash';
import { makeStyles } from '@material-ui/styles';
import { Bar } from 'react-chartjs-2';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { ChartData, ChartOptions as ChartOptionsType } from 'chart.js';
import { useSelector } from 'react-redux';
import { RxDatabase } from 'rxdb';

import { PLAZA } from '../../utils/queries';

import { AuthGuard, DataTable, Header, DetailsTable } from '../../components';
import {
  plaza,
  plazaVariables,
  plaza_plaza,
  plaza_productos,
} from '../../types/apollo';
import {
  actualizarPlazaEffect,
  aFormatoDeDinero,
  cantidadDePrendasInventario,
  obtenerDB,
  obtenerPlazaSinConexion,
  resolverPrendasObject,
} from '../../utils/functions';
import { Info } from '../../types/types';
import { RootState } from '../../types/store';
import * as Database from '../../Database';

const useStyles = makeStyles(() => ({
  content: {
    padding: 0,
  },
  inner: {
    width: '100%',
  },
  preciosAnormales: {
    overflowY: 'auto',
    maxHeight: 300,
    marginTop: 2,
    marginLeft: 2,
  },
}));
interface RouteParams {
  puntoId: string;
}
type PreciosAnormalesType = {
  nombre: string;
  id: string;
}[];

const DetallesPlaza = (
  props: RouteComponentProps<RouteParams>
): JSX.Element => {
  const { match } = props;
  const { puntoId } = match.params;
  const [loading, setLoading] = useState<boolean>(true);
  const plazaState = useSelector((state: RootState) => state.plaza);
  const [db, setDb] = useState<RxDatabase<Database.db> | null>(null);
  const [pagos, setPagos] = useState<
    { _id: string; Nombre: string; Monto: number }[]
  >([]);
  const [intercambios, setIntercambios] = useState<
    | {
        _id: string;
        Fecha: string;
        Envía: string;
        Recibe: string;
        Prendas: number;
      }[]
    | null
  >(null);
  const [ventas, setVentas] = useState<
    | {
        _id: string;
        Fecha: string;
        Tipo: string;
        Monto: number;
        Prendas: number;
      }[]
    | null
  >(null);
  const [fecha, setFecha] = useState<string>('...');
  const [gastos, setGastos] = useState<
    { Fecha: string; Descripción: string; Monto: number }[]
  >([]);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [info, setInfo] = useState<Info[]>([]);
  const [nombre, setNombre] = useState<string>('...');
  const [
    preciosAnormales,
    setPreciosAnormales,
  ] = useState<PreciosAnormalesType | null>(null);
  const [faltanteAnormales, setFaltanteAnormales] = useState(0);
  const [plazaData, setPlazaData] = useState<plaza | null>(null);
  const classes = useStyles();
  const history = useHistory();

  useQuery<plaza, plazaVariables>(PLAZA, {
    variables: { _id: puntoId },
    skip: !plazaState.online,
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      setPlazaData(data);
    },
  });

  useEffect(() => {
    obtenerDB(db, setDb);
  }, []);

  useEffect(() => {
    if (!plazaState.online) {
      obtenerPlazaSinConexion(db, puntoId, setPlazaData);
    }
  }, [db]);

  useEffect(() => {
    if (plazaState.online) {
      actualizarPlazaEffect(db, loading, plazaData, puntoId);
    }
  }, [db, plazaData, loading]);

  useEffect(() => {
    const onCompleted = async (
      plazaObj: plaza_plaza,
      productos: plaza_productos
    ) => {
      setFecha(plazaObj.fecha);
      setNombre(plazaObj.nombre);
      const ventasEnPlaza: { a: string; c: number }[] = [];
      const preciosAnormalesArr: PreciosAnormalesType = [];
      let dineroInicial = 0;
      let ventasGeneral = 0;
      let ventasClientes = 0;
      let gastosTotal = 0;
      const pagosClientes = plazaObj.pagos?.reduce((acc, cur) => {
        if (!cur.ca) {
          return acc + cur.Monto;
        }
        return acc;
      }, 0);
      let totalFaltantePorPreciosAnormales = 0;
      plazaObj.ventas?.forEach((venta) => {
        if (!venta.ca) {
          // eslint-disable-next-line prefer-spread
          ventasEnPlaza.push.apply(
            ventasEnPlaza,
            venta.ar.map((a) => {
              return {
                a: a.a,
                c:
                  a.c +
                  a.pqs.reduce((acc, cur) => {
                    return acc + cur.c;
                  }, 0),
              };
            })
          );
          let totalNormal = 0;
          if (venta.ar) {
            venta.ar.forEach((val) => {
              const prod = productos.productos?.find((opcion) => {
                return opcion?._id === val.a;
              });
              if (prod) {
                totalNormal += val.c * prod.precio;
              }
            });
          }
          if (totalNormal > venta.Monto) {
            preciosAnormalesArr.push({
              nombre: `${venta.Nombre ? venta.Nombre : ''} ${aFormatoDeDinero(
                totalNormal - venta.Monto
              )}`,
              id: venta._id || '',
            });
            totalFaltantePorPreciosAnormales += totalNormal - venta.Monto;
          }
          if (venta.Nombre !== 'público en general' && !venta.ca) {
            ventasClientes += venta.Monto;
          } else if (!venta.ca) {
            ventasGeneral += venta.Monto;
          }
        }
      });
      plazaObj.gastos.forEach((gasto) => {
        if (gasto.Descripcion === 'ingreso de efectivo') {
          dineroInicial += gasto.Monto;
        } else {
          gastosTotal += gasto.Monto;
        }
      });
      const ventasAgrupadasObj = groupBy(ventasEnPlaza, 'a');
      const ventasAgrupadas = Object.keys(ventasAgrupadasObj).map((key) => {
        return {
          a: key,
          c: ventasAgrupadasObj[key].reduce((acc, cur) => {
            return acc + cur.c;
          }, 0),
        };
      });
      const ventasResueltas = await resolverPrendasObject(ventasAgrupadas);
      const labels: string[] = [];
      const prendas: number[] = [];
      const dineroEsperadoNumber =
        dineroInicial + ventasGeneral + pagosClientes - gastosTotal;
      const infoObj = {
        'Dinero inicial': aFormatoDeDinero(dineroInicial),
        'Ventas al público en general': aFormatoDeDinero(ventasGeneral),
        'Ventas a clientes': aFormatoDeDinero(ventasClientes),
        'Pagos de clientes': aFormatoDeDinero(pagosClientes),
        'Total de gastos': aFormatoDeDinero(gastosTotal),
        'Dinero esperado': aFormatoDeDinero(dineroEsperadoNumber),
        'Dinero recibido': plazaObj.re
          ? aFormatoDeDinero(plazaObj.re)
          : '-----',
      };
      setFaltanteAnormales(totalFaltantePorPreciosAnormales);
      if (plazaObj.ventas) setPreciosAnormales(preciosAnormalesArr);
      setInfo(
        Object.entries(infoObj).map(([key, value]) => ({
          key,
          value,
        }))
      );
      ventasResueltas.sort((a, b) => {
        return -a.c + b.c;
      });
      ventasResueltas.forEach((venta) => {
        labels.push(venta.nombre);
        prendas.push(venta.c);
      });
      if (plazaObj.ventas)
        setChartData({
          labels,
          datasets: [
            {
              label: 'prendas',
              data: prendas,
              hoverBackgroundColor: 'rgba(63,81,181,1)',
              backgroundColor: 'rgba(26,35,126,1)',
              borderWidth: 1,
            },
          ],
        });
      setVentas(
        plazaObj.ventas?.map((val) => {
          return {
            _id: val._id,
            Fecha: val.Fecha,
            Tipo: `${val.Nombre}${val.ca ? ' (cancelada)' : ''}`,
            Monto: val.Monto,
            Prendas: cantidadDePrendasInventario(val.ar),
          };
        }) || null
      );
      setGastos(
        plazaObj.gastos.map((g) => {
          return {
            Fecha: g.Fecha,
            Descripción: g.Descripcion,
            Monto: g.Monto,
          };
        })
      );
      setPagos(
        plazaObj.pagos.map((p) => {
          return {
            _id: p._id,
            Fecha: p.Fecha,
            Nombre: `${p.Nombre}${p.ca ? ' (cancelado)' : ''}`,
            Monto: p.Monto,
          };
        })
      );
      setIntercambios(
        plazaObj.intercambios?.map((i) => {
          return {
            _id: i._id,
            Fecha: i.Fecha,
            Envía: `${i.Envia}${i.ca ? ' (cancelado)' : ''}`,
            Recibe: i.Recibe,
            Prendas: cantidadDePrendasInventario(i.ar),
          };
        }) || null
      );
      setLoading(false);
    };
    if (plazaData?.plaza && plazaData.productos) {
      onCompleted(plazaData.plaza, plazaData.productos);
    }
  }, [plazaData]);

  const chartOptions: ChartOptionsType = {
    indexAxis: 'y',
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  return (
    <AuthGuard roles={['ADMIN', 'PLAZA']}>
      <Header
        readOnlyRoles={['ADMIN', 'VENTAS']}
        titulo={`Plaza: ${nombre} ${fecha}`}
      />
      <Grid container spacing={1}>
        <Grid item lg={3} md={3} xl={3} xs={12}>
          <Grid container>
            <Grid item xs={12}>
              <DetailsTable
                data={info}
                hasHeaderColumns={false}
                loading={loading}
                title="Información general"
              />
            </Grid>
            {chartData && (
              <Box mt={1} width="100%">
                <Grid item xs={12}>
                  <Card elevation={4}>
                    <CardHeader
                      title={
                        <Typography variant="h6">
                          Ventas por producto
                        </Typography>
                      }
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                      <div className={classes.inner}>
                        <Bar
                          data={chartData}
                          height={200}
                          options={chartOptions}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              </Box>
            )}
          </Grid>
        </Grid>
        <Grid item lg={6} md={6} xl={6} xs={12}>
          <Grid container>
            {ventas && (
              <Grid item xs={12}>
                <Box mb={1}>
                  <DataTable
                    detailsPath={`/plazas/ventas/${puntoId}`}
                    firstRowId={false}
                    loading={loading}
                    pSize={50}
                    rawData={ventas}
                    title="Ventas"
                  />
                </Box>
              </Grid>
            )}
            <Grid item xs={12}>
              <Box mb={1}>
                <DataTable
                  detailsPath={`/plazas/pagos/${puntoId}`}
                  firstRowId={false}
                  loading={loading}
                  loadingRows={5}
                  pSize={5}
                  rawData={pagos}
                  title="Pagos"
                />
              </Box>
            </Grid>
            <Box mb={intercambios ? 1 : 0} width="100%">
              <Grid item xs={12}>
                <DataTable
                  firstRowId={false}
                  loading={loading}
                  loadingRows={5}
                  pSize={5}
                  rawData={gastos}
                  title="Gastos"
                />
              </Grid>
            </Box>
            {intercambios && (
              <Grid item xs={12}>
                <DataTable
                  detailsPath={`/plazas/intercambios/${puntoId}`}
                  firstRowId={false}
                  loading={loading}
                  pSize={5}
                  rawData={intercambios}
                  title="Intercambios"
                />
              </Grid>
            )}
          </Grid>
        </Grid>
        {preciosAnormales && (
          <Grid item lg={3} md={3} xl={3} xs={12}>
            <Grid container>
              {preciosAnormales && (
                <Grid item xs={12}>
                  <Card elevation={4}>
                    <CardHeader
                      title={
                        <Typography variant="h6">
                          {`Ventas con precios anormales (${preciosAnormales.length})`}
                        </Typography>
                      }
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                      {preciosAnormales.length > 0 ? (
                        <Box className={classes.preciosAnormales}>
                          {preciosAnormales.map((val, i) => (
                            <Box>
                              <Link
                                onClick={() => {
                                  history.push(
                                    `/plazas/ventas/${puntoId}/${val.id}`
                                  );
                                }}
                              >
                                {i + 1}.- {val.nombre}
                              </Link>
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Box className={classes.preciosAnormales} ml={3}>
                          <Typography variant="h6">{`${'  '}sin ventas`}</Typography>
                        </Box>
                      )}
                    </CardContent>
                    {faltanteAnormales > 0 && (
                      <CardActions>
                        <h2>Total :{aFormatoDeDinero(faltanteAnormales)}</h2>
                      </CardActions>
                    )}
                  </Card>
                </Grid>
              )}
            </Grid>
          </Grid>
        )}
      </Grid>
    </AuthGuard>
  );
};

export default DetallesPlaza;
