/* eslint-disable import/no-cycle */
import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, CardActions } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, FormikProps } from 'formik';
import { useQuery } from '@apollo/client';
import { Prompt } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as yup from 'yup';
import { groupBy } from 'lodash';
import { RootState } from '../../types/store';
import {
  Session,
  Ticket,
  PrincipalValues,
  ArticuloOption,
  ClienteForm,
} from '../../types/types';
import { NuevaVentaUtils, NuevaVentaUtilsVariables } from '../../types/apollo';
import { NUEVA_VENTA_UTILS } from '../../utils/queries';
import UpperButtons from './components/UpperButtons';
import LowerButtons from './components/LowerButtons';
import Tickets from './components/Tickets';
import SuccessErrorMessage from '../../components/SuccessErrorMessage';
import CancelDialog from '../../components/CancelDialog';
import AsignarForm from './components/AsignarForm';
import PagoForm from './components/PagoForm';
import CobrarForm from './components/CobrarForm';
import IntercambioForm from './components/IntercambioForm';
import RegresoForm from './components/RegresoForm';
import Reporte from './components/Reporte';
import GastoForm from './components/GastoForm';
import AuthGuard from '../../components/AuthGuard';
import { modificarTickets } from '../../actions';

const { ipcRenderer } = window.require('electron');

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
    '@media (min-height: 800px)': {
      height: '80%',
    },
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
      (values: any) => values.length > 0
    )
    .test(
      'selected',
      'No deben haber 2 productos iguales o más con diferentes precios',
      (values: any) => {
        const articulos = values.map((val: any) => {
          return {
            articulo: val.articulo.nombre,
            cantidad: val.cantidad,
            precio: val.precio,
          };
        });
        const prendasAgrupadasObj = groupBy(articulos, 'articulo');
        const noValido = Object.keys(prendasAgrupadasObj).some((producto) => {
          const { precio } = prendasAgrupadasObj[producto][0];
          return prendasAgrupadasObj[producto].some((fila) => {
            return precio !== fila.precio;
          });
        });
        return !noValido;
      }
    ),
  cantidadPagada: yup.number(),
});

const Principal = (): JSX.Element => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [eliminarTicketConfirmation, setEliminarTicketConfirmation] = useState(
    false
  );
  const [generarReporteConfirmation, setGenerarReporteConfirmation] = useState(
    false
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [agregarOpen, setAgregarOpen] = useState(false);
  const [pagoOpen, setPagoOpen] = useState(false);
  const [asignarOpen, setAsignarOpen] = useState(false);
  const [cobrarOpen, setCobrarOpen] = useState(false);
  const [intercambioOpen, setIntercambioOpen] = useState(false);
  const [total, setTotal] = useState<number | null>(null);
  const [opcionesArticulos, setOpcionesArticulos] = useState<
    ArticuloOption[] | null
  >([]);
  const [clientes, setClientes] = useState<ClienteForm[]>([]);
  const [regresoOpen, setRegresoOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(0);
  const [gastoOpen, setGastoOpen] = useState(false);
  const session: Session = useSelector((state: RootState) => state.session);
  const [esMenudeo, setEsMenudeo] = useState(
    Boolean(session.tickets[selectedTicket].esMenudeo)
  );

  useQuery<NuevaVentaUtils, NuevaVentaUtilsVariables>(NUEVA_VENTA_UTILS, {
    variables: {
      _idProductos: 'productos',
    },
    onCompleted: (data) => {
      if (data.productos) {
        ipcRenderer.send('PRODUCTOS', data.productos.objects);
        setOpcionesArticulos(data.productos.objects);
      }
      ipcRenderer.send('CLIENTES', data.clientes);
      const clientesArr: ClienteForm[] = data.clientes || [];
      setClientes(clientesArr);
    },
    skip: !session.online,
  });
  useEffect(() => {
    if (!session.online) {
      const store = ipcRenderer.sendSync('STORE');
      setClientes(store.clientes);
      setOpcionesArticulos(store.productos);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.online]);
  const handleExit = () => {
    setSuccess(false);
    setMessage(null);
  };

  const handleEliminarTicketClose = () => {
    setDialogOpen(false);
    setEliminarTicketConfirmation(false);
  };
  const handleEliminarTicket = (formikProps: FormikProps<PrincipalValues>) => {
    let nuevosTickets: Ticket[] = JSON.parse(JSON.stringify(session.tickets));
    const { length } = nuevosTickets;
    nuevosTickets = nuevosTickets.filter((_val, i) => {
      return i !== selectedTicket;
    });
    dispatch(
      modificarTickets({
        tickets: nuevosTickets,
      })
    );
    const nuevoSelectedTicket =
      selectedTicket === length - 1 ? selectedTicket - 1 : selectedTicket;
    formikProps.setFieldValue(
      'articulos',
      nuevosTickets[nuevoSelectedTicket].articulos
    );
    formikProps.setFieldValue(
      'cliente',
      nuevosTickets[nuevoSelectedTicket].cliente
    );
    setSelectedTicket(nuevoSelectedTicket);
    setEsMenudeo(Boolean(nuevosTickets[nuevoSelectedTicket].esMenudeo));
    setDialogOpen(false);
    setEliminarTicketConfirmation(false);
  };
  const handleGenerarReporteClose = () => {
    setDialogOpen(false);
    setGenerarReporteConfirmation(false);
  };

  return (
    <AuthGuard roles={['ADMIN', 'PUNTO']}>
      <SuccessErrorMessage
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        handleExit={handleExit}
        message={message}
        success={success}
      />
      <Formik<PrincipalValues>
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
        onSubmit={() => {}}
        validateOnBlur={false}
        validateOnChange={false}
        validationSchema={validationSchema}
      >
        {(formikProps) => (
          <>
            <Prompt
              message={() => '¿Desea salir? No se guardarán los cambios'}
              when={
                session.tickets.length > 1 ||
                formikProps.values.articulos.length > 0
              }
            />
            <Reporte
              handleClose={handleGenerarReporteClose}
              open={generarReporteConfirmation}
              setDialogOpen={setDialogOpen}
              setGenerarReporteConfirmation={setGenerarReporteConfirmation}
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
              opcionesArticulos={opcionesArticulos || []}
              open={intercambioOpen}
              setDialogOpen={setDialogOpen}
              setIntercambioOpen={setIntercambioOpen}
              setMessage={setMessage}
              setSuccess={setSuccess}
            />
            <RegresoForm
              opcionesArticulos={opcionesArticulos || []}
              open={regresoOpen}
              setDialogOpen={setDialogOpen}
              setMessage={setMessage}
              setRegresoOpen={setRegresoOpen}
              setSuccess={setSuccess}
            />
            <PagoForm
              clientes={clientes}
              open={pagoOpen}
              setDialogOpen={setDialogOpen}
              setMessage={setMessage}
              setPagoOpen={setPagoOpen}
              setSuccess={setSuccess}
            />
            <AsignarForm
              clientes={clientes}
              open={asignarOpen}
              setAsignarOpen={setAsignarOpen}
              setDialogOpen={setDialogOpen}
            />
            <CobrarForm
              open={cobrarOpen}
              setCobrarOpen={setCobrarOpen}
              setDialogOpen={setDialogOpen}
              setMessage={setMessage}
              setSuccess={setSuccess}
            />
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper elevation={2}>
                  <UpperButtons
                    dialogOpen={dialogOpen}
                    esMenudeo={esMenudeo}
                    formikProps={formikProps}
                    selectedTicket={selectedTicket}
                    setAgregarOpen={setAgregarOpen}
                    setDialogOpen={setDialogOpen}
                    setEsMenudeo={setEsMenudeo}
                    setGastoOpen={setGastoOpen}
                    setGenerarReporteConfirmation={
                      setGenerarReporteConfirmation
                    }
                    setIntercambioOpen={setIntercambioOpen}
                    setRegresoOpen={setRegresoOpen}
                    setSelectedTicket={setSelectedTicket}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Card elevation={2}>
                  <CardContent className={classes.cardContent}>
                    <Tickets
                      agregarOpen={agregarOpen}
                      esMenudeo={esMenudeo}
                      formikProps={formikProps}
                      opcionesArticulos={opcionesArticulos || []}
                      selectedTicket={selectedTicket}
                      setAgregarOpen={setAgregarOpen}
                      setDialogOpen={setDialogOpen}
                      setEsMenudeo={setEsMenudeo}
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
                      setPagoOpen={setPagoOpen}
                      total={total || 0}
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
