import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { useQuery, useMutation } from '@apollo/client';
import omit from 'lodash/omit';
import assign from 'lodash/assign';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import {
  Header,
  DetailsTable,
  AuthGuard,
  CancelDialog,
  SuccessErrorMessage,
} from '../../components';

import { MOVIMIENTOS } from '../../utils/queries';
import { CANCELAR_MOVIMIENTO } from '../../utils/mutations';
import crearTicketData from '../../utils/crearTicketData';

const { remote } = window.require('electron');
const { PosPrinter } = remote.require('electron-pos-printer');

const Detallesmovimiento = (props) => {
  const { match } = props;
  const { id } = match.params;
  const session = useSelector((state) => state.session);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState(null);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [detalles, setDetalles] = useState(null);
  const [cancelButton, setCancelButton] = useState(false);
  const [tipoDeMovimiento, setTipoDeMovimiento] = useState('...');
  const [reimprimirButton, setReimprimirButton] = useState(null);
  const [reimprimirDisabled, setReimprimirDisabled] = useState(null);
  const [tipo, setTipo] = useState(null);
  const [messageMutation, setMessageMutation] = useState(null);
  const [fecha, setFecha] = useState(null);
  const history = useHistory();

  useQuery(MOVIMIENTOS, {
    variables: { _id: session.puntoIdActivo },
    onCompleted: (data) => {
      if (data.movimiento === null) {
        history.push('/error/404');
      } else {
        let obj = JSON.parse(
          JSON.stringify(
            data.movimientos.movimientos.find((val) => {
              // eslint-disable-next-line no-underscore-dangle
              return val._id === id;
            })
          )
        );
        setTipoDeMovimiento(
          obj.Tipo.charAt(0).toUpperCase() + obj.Tipo.slice(1)
        );
        if (obj.Monto !== 0) {
          assign(obj, {
            Monto: Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(obj.Monto),
          });
        } else {
          obj = omit(obj, 'Monto');
        }
        setFecha(obj.Fecha);
        if (
          (dayjs().diff(dayjs(obj.Fecha), 'day', true) <= 30 ||
            JSON.parse(session.roles)[0].role === 'ADMIN') &&
          obj.Tipo !== 'venta cancelada' &&
          obj.Tipo !== 'entrada' &&
          obj.Tipo.indexOf(':') === -1 &&
          obj.Tipo.indexOf('(') === -1
        ) {
          setTipo(obj.Tipo);
          setCancelButton(true);
          setMessageMutation(
            `${
              obj.Tipo.charAt(0).toUpperCase() + obj.Tipo.slice(1)
            } cancelad${obj.Tipo.charAt(obj.Tipo.length - 1)}`
          );
        }
        if (
          obj.Tipo !== 'entrada' &&
          obj.Tipo !== 'regreso' &&
          obj.Tipo.indexOf('salida a') === -1 &&
          obj.Tipo.indexOf('(') === -1
        ) {
          setReimprimirButton(true);
        }
        assign(obj, { Fecha: dayjs(obj.Fecha).format('DD/MM/YYYY-HH:mm') });
        setInfo(
          Object.entries(omit(obj, 'articulos', '_id', 'Tipo')).map(
            ([key, value]) => ({
              key,
              value,
            })
          )
        );
        setLoading(false);
        const objDetalles = [];
        obj.articulos.forEach((r) => {
          const o = {
            articulo: r.articulo,
            // eslint-disable-next-line radix
            cantidad: parseInt(r.cantidad),
          };
          if (r.precio) {
            assign(o, { precio: parseFloat(r.precio) });
          }
          objDetalles.push(o);
        });
        setDetalles(objDetalles);
      }
    },
    onError: () => {
      history.push('/error/405');
    },
  });

  const [cancelarMovimiento, { loading: cancelLoading }] = useMutation(
    CANCELAR_MOVIMIENTO,
    {
      onCompleted: (data) => {
        if (data.cancelarMovimiento.success === true) {
          setMessage(data.cancelarMovimiento.message);
          setSuccess(true);
          setTipoDeMovimiento(
            `${tipoDeMovimiento} (cancelad${tipoDeMovimiento
              .split(' ')[0]
              .charAt(tipoDeMovimiento.split(' ')[0].length - 1)})`
          );
          setCancelOpen(false);
          setCancelButton(false);
        } else {
          setMessage(data.cancelarMovimiento.message);
        }
      },
      onError: (error) => {
        setMessage(JSON.stringify(error, null, 4));
      },
      refetchQueries: [
        {
          query: MOVIMIENTOS,
          variables: { _id: session.puntoIdActivo },
        },
      ],
    }
  );

  const handleExit = () => {
    setSuccess(null);
    setMessage(null);
  };
  const handleCancelClick = () => {
    setCancelOpen(true);
  };
  const handleCancelClose = () => {
    setCancelOpen(false);
  };
  const handleCancel = () => {
    cancelarMovimiento({
      variables: {
        nombre: session.nombre,
        puntoId: session.puntoIdActivo,
        idMovimiento: id,
        movimiento: tipo,
        articulos: detalles,
        message: messageMutation,
      },
    });
  };
  const handleReimprimir = async () => {
    setReimprimirDisabled(true);
    const data = crearTicketData(
      session.infoPunto,
      detalles,
      null,
      null,
      null,
      fecha
    );
    const options = {
      preview: false,
      width: session.ancho,
      margin: '0 0 0 0',
      copies: 1,
      printerName: session.impresora,
      timeOutPerLine: 2000,
      silent: true,
    };
    if (session.ancho && session.impresora) {
      PosPrinter.print(data, options).catch((error) => {
        // eslint-disable-next-line no-alert
        alert(error);
      });
    } else {
      // eslint-disable-next-line no-alert
      alert('seleccione una impresora y un ancho');
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setReimprimirDisabled(false);
  };

  return (
    <AuthGuard roles={['ADMIN', 'PUNTO']}>
      <Header
        buttonIcon="imprimir"
        buttonText="Reimprimir ticket"
        categoria="Movimientos"
        disabled={loading || reimprimirDisabled}
        handleOpen={reimprimirButton ? handleReimprimir : null}
        titulo={tipoDeMovimiento}
      />
      <SuccessErrorMessage
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        handleExit={handleExit}
        message={message}
        success={success}
      />
      <CancelDialog
        handleCancel={handleCancel}
        handleClose={handleCancelClose}
        loading={cancelLoading}
        message="Está seguro de que desea cancelar este movimiento?"
        open={cancelOpen}
      />
      <Grid container spacing={3}>
        <Grid item lg={4} md={4} xl={3} xs={12}>
          <DetailsTable
            data={info}
            handleCancelClick={cancelButton ? handleCancelClick : null}
            hasHeaderColumns={false}
            loading={loading}
            movimiento="movimiento"
            readOnlyRoles={['PUNTO', 'ADMIN']}
            title="Información general"
          />
        </Grid>
        <Grid item lg={8} md={8} xl={3} xs={12}>
          <DetailsTable
            data={detalles}
            hasHeaderColumns
            loading={loading}
            readOnlyRoles={['PUNTO', 'ADMIN']}
            title="Detalles"
          />
        </Grid>
      </Grid>
    </AuthGuard>
  );
};

export default Detallesmovimiento;
