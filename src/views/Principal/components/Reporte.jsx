/* eslint-disable promise/always-return */
/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useMutation, useLazyQuery } from '@apollo/client';
import {
  pdf,
  Page,
  Text,
  Document,
  StyleSheet,
  View,
} from '@react-pdf/renderer';
import Button from '@material-ui/core/Button';
import { MOVIMIENTOS } from '../../../utils/queries';
import { ENVIAR_REPORTE_URL } from '../../../utils/mutations';
import { storage } from '../../../firebase';

const CrearReporte = (props) => {
  const {
    open,
    handleClose,
    setMessage,
    setSuccess,
    setDialogOpen,
    setImprimirReporteConfirmation,
  } = props;
  const [reporteLoading, setReporteLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [data, setData] = useState(null);
  const session = useSelector((state) => state.session);

  const [getMovimientos] = useLazyQuery(MOVIMIENTOS, {
    onCompleted(res) {
      setData(res.reportePuntoData);
      setDataLoading(false);
    },
  });

  useEffect(() => {
    if (open) {
      getMovimientos({ variables: { _id: session.puntoId } });
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
    text2: {
      margin: 2,
      marginLeft: 2,
      fontSize: 14,
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
    tableColFourHeader: {
      width: '25%',
      borderStyle: 'solid',
      borderColor: '#bfbfbf',
      borderBottomColor: '#000',
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableColFour: {
      width: '25%',
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
      margin: 5,
      fontSize: 12,
      fontWeight: 500,
    },
    tableCell: {
      margin: 'auto',
      margin: 5,
      fontSize: 10,
    },
  });

  const [enviarReporteUrl] = useMutation(ENVIAR_REPORTE_URL, {
    onCompleted: (res) => {
      if (res.enviarReporteUrl.success === true) {
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
        <Text style={styles.titulo}>Reporte de ventas</Text>
        <Text
          style={styles.fechas}
        >{`${data.fechaInicial}-${data.fechaFinal}`}</Text>
        {/* <Text style={styles.text}>
          {`Deudas de clientes: ${data.deudasClientes}`}
        </Text> */}
        {/* <Text style={styles.text}>
          {`Pagos totales: ${data.totalPagos}`}
        </Text> */}
        {/* <Text style={styles.text2}>
          {`Pagos en efectivo: ${data.totalEfectivo}`}
        </Text>
        <Text style={styles.text}>
          {`Ventas: ${data.totalVentas}`}
        </Text> */}
        {data.estados.map((estado) => (
          <>
            <Text style={styles.tituloTabla}>
              {`${estado.nombre}: ${estado.balance}`}
            </Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                {['fecha', 'descripción', 'monto', 'balance'].map((header) => (
                  <View style={styles.tableColFourHeader}>
                    <Text style={styles.tableCellHeader}>{header}</Text>
                  </View>
                ))}
              </View>
              {estado.estados.map((obj) => (
                <View style={styles.tableRow}>
                  {['fecha', 'descripción', 'monto', 'balance'].map(
                    (header) => (
                      <View style={styles.tableColFour}>
                        <Text style={styles.tableCell}>{obj[header]}</Text>
                      </View>
                    )
                  )}
                </View>
              ))}
            </View>
          </>
        ))}
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
    const pathRef = storage.ref('/file.pdf');
    await pathRef.put(blob, { contentType: 'application/pdf' });
    let url;
    await pathRef.getDownloadURL().then((fileUrl) => {
      url = fileUrl;
    });
    await enviarReporteUrl({ variables: { url } });
    await pathRef.delete();
    setReporteLoading(false);
    setDialogOpen(false);
    setImprimirReporteConfirmation(false);
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
    <Dialog onClose={handleClose} open={open}>
      <DialogContent>
        <Typography>
          <>
            ¿Está seguro de que desea imprimir el reporte? <b>NO</b> se podrán
            registrar <b>ventas, gastos ni cancelaciones</b> después de esta
            acción.
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
