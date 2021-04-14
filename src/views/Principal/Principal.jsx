import React, { useState } from 'react';
import { Grid, Card, CardContent, CardActions } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
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
    height: 475,
  },
  cardActions: {
    padding: 0,
  },
  rootBar: {
    boxShadow: 'none',
  },
}));
const validationSchema = yup.object({
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
  cantidadPagada: yup
    .number()
    .required('requerido')
    .when('articulos', (articulos, schema) => {
      const total = articulos.reduce((acc, cur) => {
        return acc + cur.precio * cur.cantidad;
      }, 0);
      return schema
        .min(
          total,
          `La cantidad pagada debe ser mayor o igual a ${Intl.NumberFormat(
            'en-US',
            {
              style: 'currency',
              currency: 'USD',
            }
          ).format(total)}`
        )
        .max(total + 1000, 'Cantidad pagada inválida');
    }),
});

const Principal = (props) => {
  const { history } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState(null);
  const [eliminarTicketConfirmation, setEliminarTicketConfirmation] = useState(
    false
  );
  const [agregarOpen, setAgregarOpen] = useState(false);
  const [asignarOpen, setAsignarOpen] = useState(false);
  const [cobrarOpen, setCobrarOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [total, setTotal] = useState(null);
  const [opcionesArticulos, setOpcionesArticulos] = useState(null);
  const [clientes, setClientes] = useState(null);
  const [cuentas, setCuentas] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(0);
  const session = useSelector((state) => state.session);
  useQuery(NUEVA_VENTA_UTILS, {
    variables: {
      _idProductos: 'productos',
      _idCuentas: 'cuentas',
    },
    onCompleted: (data) => {
      setClientes(data.clientes);
      setCuentas(data.cuentas.values);
      setOpcionesArticulos(data.productos.objects);
    },
  });

  const handleExit = () => {
    setSuccess(null);
    setMessage(null);
  };
  const handleSubmit = () => {
    alert('ji');
  };

  const handleEliminarTicketClose = () => {
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
      ]
    );
    setSelectedTicket(
      selectedTicket === length - 1 ? selectedTicket - 1 : selectedTicket
    );
    setEliminarTicketConfirmation(false);
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
          // articulos: [],
          articulos: session.tickets[selectedTicket],
          cliente: '',
          articulo: '',
          cantidad: 0,
          precio: 0,
          tipoDePago: 'efectivo',
          tipoDeImpresion: 'imprimir',
          comentarios: '',
          cantidadPagada: 0,
        }}
        onSubmit={handleSubmit}
        validateOnBlur={false}
        validateOnChange={false}
        validationSchema={validationSchema}
      >
        {(formikProps) => (
          <>
            <CancelDialog
              handleCancel={() => handleEliminarTicket(formikProps)}
              handleClose={handleEliminarTicketClose}
              message="¿Está seguro de que desea eliminar el ticket?"
              open={eliminarTicketConfirmation}
            />
            <AsignarForm
              clientes={clientes}
              open={asignarOpen}
              setAsignarOpen={setAsignarOpen}
            />
            <CobrarForm
              clientes={clientes}
              open={cobrarOpen}
              setAsignarOpen={setCobrarOpen}
              setSubmitting={setSubmitting}
              submitting={submitting}
              total={total}
            />
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper className={classes.search} elevation={2}>
                  <UpperButtons
                    formikProps={formikProps}
                    selectedTicket={selectedTicket}
                    setAgregarOpen={setAgregarOpen}
                    setSelectedTicket={setSelectedTicket}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Card className={classes.search} elevation={2}>
                  <CardContent className={classes.cardContent}>
                    <Tickets
                      agregarOpen={agregarOpen}
                      formikProps={formikProps}
                      opcionesArticulos={opcionesArticulos}
                      selectedTicket={selectedTicket}
                      setAgregarOpen={setAgregarOpen}
                      setSelectedTicket={setSelectedTicket}
                      setTotal={setTotal}
                    />
                  </CardContent>
                  <CardActions className={classes.cardActions}>
                    <LowerButtons
                      formikProps={formikProps}
                      setAsignarOpen={setAsignarOpen}
                      setCobrarOpen={setCobrarOpen}
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
