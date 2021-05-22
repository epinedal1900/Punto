/* eslint-disable react/jsx-key */
/* eslint-disable import/no-cycle */

import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import { useSelector, useDispatch } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import ObjectId from 'bson-objectid';
import { useMutation, useLazyQuery } from '@apollo/client';

import groupBy from 'lodash/groupBy';
import {
  pdf,
  Page,
  Text,
  Document,
  StyleSheet,
  View,
} from '@react-pdf/renderer';
import Button from '@material-ui/core/Button';
import { MOVIMIENTOS, INVENTARIO } from '../../../utils/queries';
import {
  ENVIAR_REPORTE_URL,
  MODIFICAR_PUNTOS_ACTIVOS,
  NUEVO_REGRESO,
} from '../../../utils/mutations';
import { desactivarPunto } from '../../../actions';
import { RootState } from '../../../types/store';
import { ArticuloDB, Session } from '../../../types/types';
import {
  Inventario,
  InventarioVariables,
  ModificarPuntosActivos,
  ModificarPuntosActivosVariables,
  Movimientos,
  MovimientosVariables,
  NuevoRegreso,
  NuevoRegresoVariables,
} from '../../../types/apollo';
import { storage } from '../../../firebase';

const dayjs = require('dayjs');

const electron = window.require('electron');
const { remote } = electron;
const { BrowserWindow } = remote;

interface CrearReporteProps {
  open: boolean;
  handleClose: () => void;
  setMessage: (a: string | null) => void;
  setSuccess: (a: boolean) => void;
  setDialogOpen: (a: boolean) => void;
  setGenerarReporteConfirmation: (a: boolean) => void;
}
const CrearReporte = (props: CrearReporteProps): JSX.Element => {
  const {
    open,
    handleClose,
    setMessage,
    setSuccess,
    setDialogOpen,
    setGenerarReporteConfirmation,
  } = props;
  const [reporteLoading, setReporteLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const session: Session = useSelector((state: RootState) => state.session);
  const dispatch = useDispatch();
  const [inventario, setInventario] = useState<
    Omit<ArticuloDB, 'precio'>[] | null
  >(null);

  const [modificarPuntosActivos] = useMutation<
    ModificarPuntosActivos,
    ModificarPuntosActivosVariables
  >(MODIFICAR_PUNTOS_ACTIVOS, {
    onCompleted: (res) => {
      if (res.modificarPuntosActivos.success === true) {
        dispatch(desactivarPunto());
        localStorage.removeItem('puntoIdActivo');
      }
    },
  });

  const [regresoSinAlmacen] = useMutation<NuevoRegreso, NuevoRegresoVariables>(
    NUEVO_REGRESO
  );

  const [getInventario] = useLazyQuery<Inventario, InventarioVariables>(
    INVENTARIO,
    {
      onCompleted(invRes) {
        if (invRes.inventario) {
          const invObj = invRes.inventario.inventario
            .filter((val) => {
              return val.cantidad > 0;
            })
            .map((val) => {
              return {
                articulo: val.articulo,
                cantidad: val.cantidad,
              };
            });
          setInventario(invObj);
        }
      },
    }
  );

  const [getMovimientos] = useLazyQuery<Movimientos, MovimientosVariables>(
    MOVIMIENTOS,
    {
      onCompleted(res) {
        if (res.movimientos) {
          const { movimientos } = res.movimientos;
          const { gastos } = res.movimientos;
          let ventasPublico = 0;
          let ventasAClientes = 0;
          let pagosClientes = 0;
          let totalGastos = 0;
          let gastosArr;
          let dineroInicial = 0;
          if (gastos.length > 0) {
            const gastosFiltered = gastos.filter((val) => {
              return val.Descripcion !== 'ingreso de efectivo';
            });
            gastos.forEach((val) => {
              if (val.Descripcion === 'ingreso de efectivo') {
                dineroInicial += val.Monto;
              }
            });
            const objGastos = groupBy(gastosFiltered, 'Descripcion');
            if (gastosFiltered.length > 0) {
              gastosArr = Object.keys(objGastos).map((key) => {
                return {
                  descripción: key,
                  monto: Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(
                    objGastos[key].reduce((acc, cur) => {
                      return acc + cur.Monto;
                    }, 0)
                  ),
                };
              });
              totalGastos = gastosFiltered.reduce((acc, cur) => {
                return acc + cur.Monto;
              }, 0);
            }
          }
          movimientos.forEach((movimiento) => {
            if (movimiento.Tipo === 'venta') {
              ventasPublico += movimiento.Monto;
            } else if (
              movimiento.Tipo.split(':').length === 2 &&
              movimiento.Tipo.split(':')[0] === 'venta'
            ) {
              // es de cliente y no esta cancelada
              if (movimiento.Tipo.split('(').length === 1) {
                ventasAClientes += movimiento.Monto;
              }
              if (movimiento.Pago) {
                pagosClientes += movimiento.Pago;
              }
            } else if (
              movimiento.Tipo.split(':').length === 2 &&
              movimiento.Tipo.split(':')[0] === 'pago' &&
              movimiento.Tipo.split('(').length === 1
            ) {
              pagosClientes += movimiento.Monto;
            }
          });
          const dineroEsperado =
            dineroInicial + ventasPublico + pagosClientes - totalGastos;
          const dataObj = {
            nombre: session.nombre,
            fecha: dayjs(
              new ObjectId(session.puntoIdActivo).getTimestamp()
            ).format('DD-MM-YYYY'),
            dineroInicial: Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(dineroInicial),
            ventasPublico: Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(ventasPublico),
            ventasAClientes: Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(ventasAClientes),
            pagosClientes: Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(pagosClientes),
            totalGastos: Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(totalGastos),
            gastosArr,
            dineroEsperado: Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(dineroEsperado),
          };
          setData(dataObj);
        }
        setDataLoading(false);
      },
      fetchPolicy: 'network-only',
    }
  );

  useEffect(() => {
    if (open) {
      getMovimientos({ variables: { _id: session.puntoIdActivo } });
      if (session.sinAlmacen) {
        getInventario({ variables: { nombre: session.nombre } });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const styles = StyleSheet.create({
    body: {
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 35,
    },
    titulo: {
      fontSize: 24,
      textAlign: 'right',
      fontFamily: 'Times-Roman',
    },
    fechas: {
      fontSize: 12,
      textAlign: 'right',
      marginBottom: 20,
    },
    text: {
      margin: 2,
      fontSize: 14,
      textAlign: 'justify',
      fontFamily: 'Times-Roman',
    },
    textBold: {
      margin: 2,
      marginLeft: 2,
      fontWeight: 900,
      fontSize: 15,
      textAlign: 'justify',
      fontFamily: 'Times-Roman',
    },
    tituloTabla: {
      margin: 4,
      marginTop: 10,
      fontSize: 16,
      textAlign: 'center',
      fontFamily: 'Times-Roman',
    },
    pageNumber: {
      position: 'absolute',
      fontSize: 12,
      bottom: 30,
      left: 0,
      right: 0,
      textAlign: 'center',
      color: 'grey',
    },
    table: {
      display: 'table',
      width: 'auto',
      borderStyle: 'solid',
      borderColor: '#bfbfbf',
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    tableRow: {
      margin: 'auto',
      flexDirection: 'row',
    },
    tableColTwoHeader: {
      width: '50%',
      borderStyle: 'solid',
      borderColor: '#bfbfbf',
      borderBottomColor: '#000',
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableColTwo: {
      width: '50%',
      borderStyle: 'solid',
      borderColor: '#bfbfbf',
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableColFiveHeader: {
      width: '20%',
      borderStyle: 'solid',
      borderColor: '#bfbfbf',
      borderBottomColor: '#000',
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableColFive: {
      width: '20%',
      borderStyle: 'solid',
      borderColor: '#bfbfbf',
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableCellHeader: {
      margin: 'auto',
      // @ts-expect-error: error
      margin: 5,
      fontSize: 12,
      fontWeight: 500,
    },
    tableCell: {
      margin: 'auto',
      // @ts-expect-error: error

      margin: 5,
      fontSize: 10,
    },
  });

  const [enviarReporteUrl] = useMutation(ENVIAR_REPORTE_URL, {
    onCompleted: (res) => {
      if (res.enviarReporteUrl.success === true) {
        modificarPuntosActivos({
          variables: { nombre: session.nombre, propiedad: 'id' },
        });
        setMessage(res.enviarReporteUrl.message);
        setSuccess(true);
      } else {
        setMessage(res.enviarReporteUrl.message);
      }
    },
    onError: (error) => {
      setMessage(JSON.stringify(error, null, 4));
    },
  });

  const doc = data && (
    <Document>
      <Page style={styles.body}>
        <Text style={styles.titulo}>{`Reporte de ventas: ${data.nombre}`}</Text>
        <Text style={styles.fechas}>{data.fecha}</Text>
        <Text style={styles.text}>
          {`Dinero inicial: ${data.dineroInicial}`}
        </Text>
        <Text
          style={styles.text}
        >{`Ventas al público en general : ${data.ventasPublico}`}</Text>
        <Text
          style={styles.text}
        >{`Ventas a clientes: ${data.ventasAClientes}`}</Text>
        <Text style={styles.text}>
          {`Pagos en efectivo de clientes: ${data.pagosClientes}`}
        </Text>
        <Text
          style={styles.text}
        >{`Total de gastos: ${data.totalGastos}`}</Text>
        <Text style={styles.text}> </Text>
        <Text
          style={styles.textBold}
        >{`Efectivo esperado: ${data.dineroEsperado}`}</Text>
        <Text style={styles.text}>Efectivo recibido:_____________________</Text>
        <Text style={styles.text}>Firma:_____________________</Text>
        {data.gastosArr && (
          <>
            <Text style={styles.tituloTabla}>Desglose de gastos</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                {['Descripción', 'Monto'].map((header) => (
                  <View style={styles.tableColTwoHeader}>
                    <Text style={styles.tableCellHeader}>{header}</Text>
                  </View>
                ))}
              </View>
              {data.gastosArr.map((obj: any) => (
                <View style={styles.tableRow}>
                  {['descripción', 'monto'].map((header) => (
                    <View style={styles.tableColTwo}>
                      <Text style={styles.tableCell}>{obj[header]}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </>
        )}
        <Text
          fixed
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          style={styles.pageNumber}
        />
      </Page>
    </Document>
  );

  const handleCrear = async () => {
    setReporteLoading(true);
    const blob = await pdf(doc).toBlob();
    const pathRef = storage.ref(`/${session.nombre}: ${data.fecha}.pdf`);
    await pathRef.put(blob, { contentType: 'application/pdf' });
    let url;
    await pathRef.getDownloadURL().then((fileUrl) => {
      url = fileUrl;
    });
    if (inventario && inventario.length > 0) {
      await regresoSinAlmacen({
        variables: {
          obj: {
            tipo: 'regreso',
            articulos: inventario,
          },
          puntoId: session.puntoIdActivo,
          nombre: session.nombre,
        },
      });
    }
    await enviarReporteUrl({
      variables: { url, nombre: `${session.nombre}: ${data.fecha}` },
    });
    setReporteLoading(false);
    setDialogOpen(false);
    setGenerarReporteConfirmation(false);
    // eslint-disable-next-line no-new
    const win = new BrowserWindow({ width: 600, height: 800 });
    win.loadURL(url);
  };
  const [espera, setEspera] = useState(true);

  useEffect(() => {
    const bloquearSubmit = async () => {
      setEspera(true);
      await new Promise((resolve) => setTimeout(resolve, 10000));
      setEspera(false);
    };
    bloquearSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog onClose={!reporteLoading ? handleClose : undefined} open={open}>
      <DialogContent>
        <Typography>
          <>
            ¿Está seguro de que desea imprimir el reporte? <b>NO</b> se podrán
            registrar{' '}
            <b>ventas, gastos, intercambios, regresos ni cancelaciones</b>{' '}
            después de esta acción.
          </>
        </Typography>
        {reporteLoading && <LinearProgress />}
      </DialogContent>
      <DialogActions>
        <Button
          color="default"
          disabled={reporteLoading}
          onClick={handleClose}
          size="small"
        >
          Volver
        </Button>
        <Button
          autoFocus
          color="primary"
          disabled={reporteLoading || espera || dataLoading}
          onClick={handleCrear}
          size="small"
          variant="outlined"
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CrearReporte;
