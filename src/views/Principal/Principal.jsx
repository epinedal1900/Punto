import React, { useState } from 'react';
import { Grid, Card, CardContent, CardActions } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Formik } from 'formik';
import { useQuery } from '@apollo/client';
import { useSelector, useDispatch } from 'react-redux';
import * as yup from 'yup';
import { NUEVA_VENTA_UTILS } from '../../utils/queries';
import UpperButtons from './components/UpperButtons';
import LowerButtons from './components/LowerButtons';
import Tickets from './components/Tickets';
import SuccessErrorMessage from '../../components/SuccessErrorMessage';
import CancelDialog from '../../components/CancelDialog';
import AsignarForm from './components/AsignarForm';
import CobrarForm from './components/CobrarForm';
import IntercambioForm from './components/IntercambioForm';
import RegresoForm from './components/RegresoForm';
import Reporte from './components/Reporte';
import GastoForm from './components/GastoForm';
import AuthGuard from '../../components/AuthGuard';
import { modificarTickets } from '../../actions';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    margin: 'none',
  },
  flexGrow: {
    flexGrow: 1,
  },
  container: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
  },
  content: {
    overflowY: 'auto',
    flex: '1 1 auto',
  },
  cardContent: {
    padding: 0,
    height: 525,
  },
  cardActions: {
    padding: 0,
  },
  rootBar: {
    boxShadow: 'none',
  },
}));

const validationSchema = yup.object({
  cliente: yup.object(),
  articulos: yup
    .array()
    .of(
      yup.object().shape({
        articulo: yup.object().required('requerido').typeError('requerido'),
        cantidad: yup.number().required('requerido').min(1, 'requerido'),
        precio: yup.number().required('requerido').min(1, 'requerido'),
      })
    )
    .test(
      'selected',
      'Ingrese al menos 1 artículo',
      (values) => values.length > 0
    ),
  cantidadPagada: yup.number(),
});

const Principal = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState(null);
  const [eliminarTicketConfirmation, setEliminarTicketConfirmation] = useState(
    false
  );
  const [
    imprimirReporteConfirmation,
    setImprimirReporteConfirmation,
  ] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [agregarOpen, setAgregarOpen] = useState(false);
  const [asignarOpen, setAsignarOpen] = useState(false);
  const [cobrarOpen, setCobrarOpen] = useState(false);
  const [intercambioOpen, setIntercambioOpen] = useState(false);
  const [total, setTotal] = useState(null);
  const [opcionesArticulos, setOpcionesArticulos] = useState(null);
  const [clientes, setClientes] = useState(null);
  const [regresoOpen, setRegresoOpen] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(0);
  const [gastoOpen, setGastoOpen] = useState(false);
  const session = useSelector((state) => state.session);

  useQuery(NUEVA_VENTA_UTILS, {
    variables: {
      _idProductos: 'productos',
    },
    onCompleted: (data) => {
      setClientes(data.clientes);
      setOpcionesArticulos(data.productos.objects);
    },
  });

  const handleExit = () => {
    setSuccess(null);
    setMessage(null);
  };

  const handleEliminarTicketClose = () => {
    setDialogOpen(false);
    setEliminarTicketConfirmation(false);
  };
  const handleEliminarTicket = (formikProps) => {
    let nuevosTickets = JSON.parse(JSON.stringify(session.tickets));
    const { length } = nuevosTickets;
    nuevosTickets = nuevosTickets.filter((val, i) => {
      return i !== selectedTicket;
    });
    dispatch(
      modificarTickets({
        tickets: nuevosTickets,
      })
    );
    formikProps.setFieldValue(
      'articulos',
      nuevosTickets[
        selectedTicket === length - 1 ? selectedTicket - 1 : selectedTicket
      ].articulos
    );
    formikProps.setFieldValue(
      'cliente',
      nuevosTickets[
        selectedTicket === length - 1 ? selectedTicket - 1 : selectedTicket
      ].cliente
    );
    setSelectedTicket(
      selectedTicket === length - 1 ? selectedTicket - 1 : selectedTicket
    );
    setDialogOpen(false);
    setEliminarTicketConfirmation(false);
  };
  const handleImprimirReporteClose = () => {
    setDialogOpen(false);
    setImprimirReporteConfirmation(false);
  };

  return (
    <AuthGuard roles={['ADMIN', 'PUNTO']}>
      <SuccessErrorMessage
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        handleExit={handleExit}
        message={message}
        success={success}
      />
      <Formik
        initialValues={{
          articulos: session.tickets[selectedTicket].articulos,
          cliente: session.tickets[selectedTicket].cliente,
          articulo: '',
          cantidad: 0,
          precio: 0,
          tipoDePago: 'efectivo',
          tipoDeImpresion: 'imprimir',
          comentarios: '',
          cantidadPagada: 0,
        }}
        validateOnBlur={false}
        validateOnChange={false}
        validationSchema={validationSchema}
      >
        {(formikProps) => (
          <>
            <Reporte
              handleClose={handleImprimirReporteClose}
              open={imprimirReporteConfirmation}
              setDialogOpen={setDialogOpen}
              setImprimirReporteConfirmation={setImprimirReporteConfirmation}
              setMessage={setMessage}
              setSuccess={setSuccess}
            />
            <CancelDialog
              handleCancel={() => handleEliminarTicket(formikProps)}
              handleClose={handleEliminarTicketClose}
              message="¿Está seguro de que desea eliminar el ticket?"
              open={eliminarTicketConfirmation}
            />
            <GastoForm
              open={gastoOpen}
              setDialogOpen={setDialogOpen}
              setGastoOpen={setGastoOpen}
              setMessage={setMessage}
              setSuccess={setSuccess}
            />
            <IntercambioForm
              opcionesArticulos={opcionesArticulos}
              open={intercambioOpen}
              setDialogOpen={setDialogOpen}
              setIntercambioOpen={setIntercambioOpen}
              setMessage={setMessage}
              setSuccess={setSuccess}
            />
            <RegresoForm
              opcionesArticulos={opcionesArticulos}
              open={regresoOpen}
              setDialogOpen={setDialogOpen}
              setMessage={setMessage}
              setRegresoOpen={setRegresoOpen}
              setSuccess={setSuccess}
            />
            <AsignarForm
              clientes={clientes}
              open={asignarOpen}
              setAsignarOpen={setAsignarOpen}
              setDialogOpen={setDialogOpen}
            />
            <CobrarForm
              clientes={clientes}
              open={cobrarOpen}
              setCobrarOpen={setCobrarOpen}
              setDialogOpen={setDialogOpen}
              setMessage={setMessage}
              setSuccess={setSuccess}
              total={total}
            />
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper className={classes.search} elevation={2}>
                  <UpperButtons
                    dialogOpen={dialogOpen}
                    formikProps={formikProps}
                    selectedTicket={selectedTicket}
                    setAgregarOpen={setAgregarOpen}
                    setDialogOpen={setDialogOpen}
                    setGastoOpen={setGastoOpen}
                    setImprimirReporteConfirmation={
                      setImprimirReporteConfirmation
                    }
                    setIntercambioOpen={setIntercambioOpen}
                    setRegresoOpen={setRegresoOpen}
                    setSelectedTicket={setSelectedTicket}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Card className={classes.search} elevation={2}>
                  <CardContent className={classes.cardContent}>
                    <Tickets
                      agregarOpen={agregarOpen}
                      dialogOpen={dialogOpen}
                      formikProps={formikProps}
                      opcionesArticulos={opcionesArticulos}
                      selectedTicket={selectedTicket}
                      setAgregarOpen={setAgregarOpen}
                      setDialogOpen={setDialogOpen}
                      setSelectedTicket={setSelectedTicket}
                      setTotal={setTotal}
                    />
                  </CardContent>
                  <CardActions className={classes.cardActions}>
                    <LowerButtons
                      dialogOpen={dialogOpen}
                      formikProps={formikProps}
                      setAsignarOpen={setAsignarOpen}
                      setCobrarOpen={setCobrarOpen}
                      setDialogOpen={setDialogOpen}
                      setEliminarTicketConfirmation={
                        setEliminarTicketConfirmation
                      }
                      total={total}
                    />
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </Formik>
    </AuthGuard>
  );
};

export default Principal;
