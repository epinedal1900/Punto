/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import { useSelector, useDispatch } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import ObjectId from 'bson-objectid';
import { useMutation, useLazyQuery } from '@apollo/client';
import dayjs from 'dayjs';

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
import { SetState } from '../../../types/types';
import { RootState } from '../../../types/store';
import {
  Chat,
  desactivarPlazaConInventario,
  desactivarPlazaConInventarioVariables,
  enviarReporteUrl,
  enviarReporteUrlVariables,
  Inventario,
  InventarioVariables,
  Inventario_inventario_inv,
  nuevoIntercambio,
  nuevoIntercambioVariables,
  plaza,
  plazaVariables,
} from '../../../types/apollo';
import { desactivarPunto } from '../../../actions';
import {
  DESACTIVAR_PLAZA_CON_INVENTARIO,
  ENVIAR_REPORTE_URL,
  NUEVO_INTERCAMBIO,
} from '../../../utils/mutations';
import { INVENTARIO, PLAZA } from '../../../utils/queries';
import { storage } from '../../../firebase';
import { aFormatoDeDinero, cantidadEnPrenda } from '../../../utils/functions';

interface CrearReporteProps {
  open: boolean;
  handleClose: () => void;
  setMessage: SetState<string | null>;
  setSuccess: SetState<boolean>;
  setGenerarReporteConfirmation: SetState<boolean>;
  setDialogOpen: SetState<boolean>;
}
const CrearReporte = (props: CrearReporteProps): JSX.Element => {
  const {
    open,
    handleClose,
    setMessage,
    setSuccess,
    setGenerarReporteConfirmation,
    setDialogOpen,
  } = props;
  const [reporteLoading, setReporteLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const plazaState = useSelector((state: RootState) => state.plaza);
  const session = useSelector((state: RootState) => state.session);
  const dispatch = useDispatch();
  const [inventario, setInventario] = useState<
    Inventario_inventario_inv[] | null
  >(null);

  const [desactivarPlazaConInventarioFunction] = useMutation<
    desactivarPlazaConInventario,
    desactivarPlazaConInventarioVariables
  >(DESACTIVAR_PLAZA_CON_INVENTARIO, {
    onCompleted: (res) => {
      if (res.desactivarPlazaConInventario.success) {
        dispatch(desactivarPunto());
      }
    },
  });

  const [nuevoIntercambioFunction] = useMutation<
    nuevoIntercambio,
    nuevoIntercambioVariables
  >(NUEVO_INTERCAMBIO);

  const [getInventario] = useLazyQuery<Inventario, InventarioVariables>(
    INVENTARIO,
    {
      onCompleted(invRes) {
        if (invRes.inventario?.inv) {
          setInventario(
            invRes.inventario.inv.filter((val) => {
              return cantidadEnPrenda(val) > 0;
            })
          );
        }
      },
    }
  );

  const [obtenerPlaza] = useLazyQuery<plaza, plazaVariables>(PLAZA, {
    onCompleted(res) {
      if (res.plaza) {
        const { ventas, pagos, gastos, nombre } = res.plaza;
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
                Descripción: key,
                Monto: aFormatoDeDinero(
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
        ventas?.forEach((venta) => {
          if (venta.Nombre !== 'público en general' && !venta.ca) {
            ventasAClientes += venta.Monto;
          } else if (!venta.ca) {
            ventasPublico += venta.Monto;
          }
        });
        pagos.forEach((pago) => {
          if (!pago.ca) {
            pagosClientes += pago.Monto;
          }
        });
        const dineroEsperado =
          dineroInicial + ventasPublico + pagosClientes - totalGastos;
        const dataObj = {
          nombre,
          fecha: dayjs(
            new ObjectId(plazaState._idPunto || '').getTimestamp()
          ).format('DD-MM-YYYY'),
          dineroInicial: aFormatoDeDinero(dineroInicial),
          ventasPublico: aFormatoDeDinero(ventasPublico),
          ventasAClientes: aFormatoDeDinero(ventasAClientes),
          pagosClientes: aFormatoDeDinero(pagosClientes),
          totalGastos: aFormatoDeDinero(totalGastos),
          gastosArr,
          dineroEsperado: aFormatoDeDinero(dineroEsperado),
        };
        setData(dataObj);
      }
      setDataLoading(false);
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (open && plazaState._idPunto) {
      obtenerPlaza({
        variables: { _id: plazaState._idPunto },
      });
      if (plazaState.sinAlmacen && plazaState.idInventario) {
        getInventario({ variables: { _id: plazaState.idInventario } });
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

  const [enviarReporteUrlFunction] = useMutation<
    enviarReporteUrl,
    enviarReporteUrlVariables
  >(ENVIAR_REPORTE_URL, {
    onCompleted: (res) => {
      if (res.enviarReporteUrl.success === true && plazaState.idInventario) {
        desactivarPlazaConInventarioFunction({
          variables: {
            in: plazaState.idInventario,
          },
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
                  {['Descripción', 'Monto'].map((header) => (
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
    const pathRef = storage.ref(`/PDFs/${data.nombre}: ${data.fecha}.pdf`);
    await pathRef.put(blob, { contentType: 'application/pdf' });
    const url = await pathRef.getDownloadURL();
    if (
      inventario &&
      inventario.length > 0 &&
      session.nombre &&
      plazaState._idPuntoPrincipal &&
      plazaState._idPunto
    ) {
      await nuevoIntercambioFunction({
        variables: {
          _id: new ObjectId().toString(),
          prendas: inventario.map((v) => {
            const pqs = v.pqs.map((p) => {
              return { p: p.p, c: p.c };
            });
            return { a: v.a, c: v.c, pqs };
          }),
          puntoIdEmisor: plazaState._idPunto,
          puntoIdReceptor: plazaState._idPuntoPrincipal,
        },
      });
    }
    await enviarReporteUrlFunction({
      variables: { url, chat: Chat.ventas },
    });
    setReporteLoading(false);
    setGenerarReporteConfirmation(false);
    setDialogOpen(false);

    window.open(url);
  };

  const [espera, setEspera] = useState(true);

  useEffect(() => {
    const bloquearSubmit = async () => {
      setEspera(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));
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
        {(reporteLoading || dataLoading) && <LinearProgress />}
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
