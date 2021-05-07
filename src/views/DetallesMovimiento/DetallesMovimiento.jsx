/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { useQuery, useMutation } from '@apollo/client';
import omit from 'lodash/omit';
import assign from 'lodash/assign';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import groupBy from 'lodash/groupBy';
import { useHistory } from 'react-router-dom';

import {
  Header,
  DetailsTable,
  AuthGuard,
  CancelDialog,
  SuccessErrorMessage,
} from '../../components';

import { MOVIMIENTOS, DETALLES_MOVIMIENTOS_UTILS } from '../../utils/queries';
import {
  CANCELAR_MOVIMIENTO,
  REGISTRAR_DISCREPANCIAS,
} from '../../utils/mutations';
import crearTicketData from '../../utils/crearTicketData';
import crearTicketSinPrecioData from '../../utils/crearTicketSinPrecioData';
import EditForm from './components/EditForm';

const { remote } = window.require('electron');
const { PosPrinter } = remote.require('electron-pos-printer');

const onCompleted = (
  productos,
  movimientosOnline,
  setTipoDeMovimiento,
  setTipo,
  setCancelButton,
  setInfoRaw,
  setInfo,
  setMessageMutation,
  setReimprimirButton,
  setFecha,
  setOpcionesArticulos,
  setDetalles,
  setLoading,
  session,
  id,
  movimientosOffline
) => {
  let obj = movimientosOnline.find((val) => {
    // eslint-disable-next-line no-underscore-dangle
    return val._id === id;
  });
  let registroOnline = true;
  if (!obj) {
    registroOnline = false;
    obj = movimientosOffline.find((val) => {
      // eslint-disable-next-line no-underscore-dangle
      return val._id === id;
    });
  }
  setTipoDeMovimiento(obj.Tipo.charAt(0).toUpperCase() + obj.Tipo.slice(1));
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
  if (obj.Pago !== null) {
    assign(obj, {
      Pago: Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(obj.Pago),
    });
  } else {
    obj = omit(obj, 'Pago');
  }
  setFecha(obj.Fecha);
  if (
    (dayjs().diff(dayjs(obj.Fecha), 'day', true) <= 30 ||
      JSON.parse(session.roles)[0].role === 'ADMIN') &&
    ((!registroOnline && !(obj.Tipo.indexOf('pago:') === -1)) ||
      (!registroOnline && obj.Tipo.indexOf('pago:') === -1)) &&
    obj.Tipo.indexOf('(') === -1 &&
    ((registroOnline && session.online) || (!registroOnline && !session.online))
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
    obj.Tipo.indexOf('pago:') === -1 &&
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
  setInfoRaw(omit(obj, 'articulos', '_id', 'Tipo'));
  const objDetalles = [];
  const objOpcionesArticulos = [];
  if (obj.articulos) {
    obj.articulos.forEach((r) => {
      const o = {
        articulo: r.articulo,
        cantidad: parseInt(r.cantidad),
      };
      if (r.precio) {
        assign(o, { precio: parseFloat(r.precio) });
      }
      objDetalles.push(o);
      const prendaObj = productos.find((val) => {
        return val.nombre === r.articulo;
      });
      objOpcionesArticulos.push({
        articulo: prendaObj,
        cantidad: parseInt(r.cantidad),
      });
    });
    setDetalles(objDetalles);
    setOpcionesArticulos(objOpcionesArticulos);
  }
  setLoading(false);
};

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
  const [tipo, setTipo] = useState('');
  const [messageMutation, setMessageMutation] = useState(null);
  const [fecha, setFecha] = useState(null);
  const [editOpen, setEditOpen] = useState(null);
  const [opcionesArticulos, setOpcionesArticulos] = useState(null);
  const [infoRaw, setInfoRaw] = useState(null);
  const [productos, setProductos] = useState(null);
  const [nuevaInfo, setNuevaInfo] = useState(null);
  const [nuevosArticulos, setNuevosArticulos] = useState(null);
  const history = useHistory();

  const { ipcRenderer } = window.require('electron');

  useQuery(DETALLES_MOVIMIENTOS_UTILS, {
    skip: !session.online,
    variables: { _id: session.puntoIdActivo, _idProductos: 'productos' },
    onCompleted: (data) => {
      if (data.movimiento === null) {
        history.push('/error/404');
      } else {
        setProductos(data.productos.objects);
        ipcRenderer.send('PRODUCTOS', data.productos.objects);
        ipcRenderer.send('PLAZA', data.movimientos);
        onCompleted(
          data.productos.objects,
          data.movimientos.movimientos,
          setTipoDeMovimiento,
          setTipo,
          setCancelButton,
          setInfoRaw,
          setInfo,
          setMessageMutation,
          setReimprimirButton,
          setFecha,
          setOpcionesArticulos,
          setDetalles,
          setLoading,
          session,
          id
        );
      }
    },
    onError: () => {
      history.push('/error/405');
    },
  });
  useEffect(() => {
    if (!session.online) {
      const store = ipcRenderer.sendSync('STORE');
      onCompleted(
        store.productos,
        store.plaza.movimientos,
        setTipoDeMovimiento,
        setTipo,
        setCancelButton,
        setInfoRaw,
        setInfo,
        setMessageMutation,
        setReimprimirButton,
        setFecha,
        setOpcionesArticulos,
        setDetalles,
        setLoading,
        session,
        id,
        store.movimientosOffline
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.online]);
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
              .charAt(tipoDeMovimiento.split(': ')[0].length - 1)})`
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
  const [
    registrarDiscrepancias,
    { loading: registrarDiscrepanciaLoading },
  ] = useMutation(REGISTRAR_DISCREPANCIAS, {
    onCompleted: (data) => {
      if (data.registrarDiscrepancias.success === true) {
        setMessage(data.registrarDiscrepancias.message);
        setSuccess(true);
        setEditOpen(false);
        setCancelButton(false);
        setInfo(
          Object.entries(nuevaInfo).map(([key, value]) => ({ key, value }))
        );
        setDetalles(nuevosArticulos);
        setTipoDeMovimiento('Entrada (corregida)');
      } else {
        setMessage(data.registrarDiscrepancias.message);
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
  });
  const handleExit = () => {
    setSuccess(null);
    setMessage(null);
  };
  const handleCancelClick = () => {
    if (tipo === 'entrada') {
      setEditOpen(true);
    } else {
      setCancelOpen(true);
    }
  };
  const handleCancelClose = () => {
    setCancelOpen(false);
  };
  const handleCancel = () => {
    if (session.online) {
      cancelarMovimiento({
        variables: {
          nombre: session.nombre,
          puntoId: session.puntoIdActivo,
          idMovimiento: id,
          movimiento: tipo,
          articulos: detalles,
          message: messageMutation,
          conCliente: tipo.indexOf('venta:') !== -1,
        },
      });
    } else if (tipo.split('Sin conexión:')[1]) {
      const tipoStr = tipo.split('Sin conexión: ')[1];
      ipcRenderer.send('CANCELAR_MOVIMIENTO', {
        _idOffline: id,
        tipo: tipoStr,
      });
      setMessage('Movimiento cancelado');
      setSuccess(true);
      let str = `Sin conexión: ${tipoStr} (cancelad${tipoStr
        .split(':')[0]
        .charAt(tipoStr.split(':')[0].length - 1)})`;
      if (tipoStr.split(' ')[0] === 'salida') {
        str = `Sin conexión: ${tipoStr} (cancelada)`;
      }
      setTipoDeMovimiento(str);
      setCancelOpen(false);
      setCancelButton(false);
    }
  };
  const handleReimprimir = async () => {
    setReimprimirDisabled(true);
    let data;
    if (tipoDeMovimiento.indexOf('salida') === -1) {
      data = crearTicketData(
        session.infoPunto,
        detalles,
        null,
        null,
        null,
        fecha
      );
    } else {
      data = crearTicketSinPrecioData(session.infoPunto, detalles, fecha);
    }
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
  const handleEditClose = () => {
    setEditOpen(false);
  };
  const handleEdit = (values) => {
    const prendas = values.articulos.reduce((acc, cur) => {
      return acc + cur.cantidad;
    }, 0);
    const objInfo = JSON.parse(JSON.stringify(infoRaw));
    assign(objInfo, { Prendas: prendas });
    setNuevaInfo(objInfo);
    const n = values.articulos.map((val) => {
      return { articulo: val.articulo.nombre, cantidad: val.cantidad };
    });
    const obj = groupBy(n, 'articulo');
    const prendasAgrupadas = Object.keys(obj).map((key) => {
      return {
        articulo: key,
        cantidad: obj[key].reduce((acc, cur) => {
          return acc + cur.cantidad;
        }, 0),
      };
    });
    setNuevosArticulos(prendasAgrupadas);
    const registrosDePrendasNoExistentes = [];
    const prendasEnComun = [];
    const prendasQueNoSeRegistraron = [];
    detalles.forEach((val) => {
      const p = prendasAgrupadas.find((val2) => {
        return val2.articulo === val.articulo;
      });
      if (p) {
        if (val.cantidad !== p.cantidad) {
          prendasEnComun.push({
            articulo: val.articulo,
            cantidad: -val.cantidad + p.cantidad,
          });
        }
      } else {
        prendasQueNoSeRegistraron.push({
          articulo: val.articulo,
          cantidad: -val.cantidad,
        });
      }
    });
    prendasAgrupadas.forEach((val) => {
      const p = detalles.find((val2) => {
        return val2.articulo === val.articulo;
      });
      if (!p) {
        registrosDePrendasNoExistentes.push({
          articulo: val.articulo,
          cantidad: val.cantidad,
        });
      }
    });
    const discrepancias = registrosDePrendasNoExistentes
      .concat(prendasEnComun)
      .concat(prendasQueNoSeRegistraron);
    registrarDiscrepancias({
      variables: {
        articulos: discrepancias,
        puntoId: session.puntoIdActivo,
        tipo: 'entrada',
        nombre: session.nombre,
        sobrescribir: prendasAgrupadas,
        entradaId: id,
      },
    });
  };
  return (
    <AuthGuard roles={['ADMIN', 'PUNTO']}>
      <Header
        buttonIcon="imprimir"
        buttonText={
          tipoDeMovimiento.indexOf('salida') === -1
            ? 'Reimprimir ticket'
            : 'Imprimir ticket'
        }
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
      <EditForm
        articulos={opcionesArticulos}
        handleEditClose={handleEditClose}
        handleSubmit={handleEdit}
        loading={registrarDiscrepanciaLoading}
        opcionesArticulos={productos}
        open={editOpen}
      />
      <Grid container spacing={3}>
        <Grid item lg={4} md={4} xl={3} xs={12}>
          <DetailsTable
            cancelarText={tipo === 'entrada' ? 'Corregir entrada' : null}
            data={info}
            handleCancelClick={cancelButton ? handleCancelClick : null}
            hasHeaderColumns={false}
            loading={loading}
            movimiento="movimiento"
            readOnlyRoles={['PUNTO', 'ADMIN']}
            title="Información general"
          />
        </Grid>
        {detalles && (
          <Grid item lg={8} md={8} xl={3} xs={12}>
            <DetailsTable
              data={detalles}
              hasHeaderColumns
              loading={loading}
              readOnlyRoles={['PUNTO', 'ADMIN']}
              title="Detalles"
            />
          </Grid>
        )}
      </Grid>
    </AuthGuard>
  );
};

export default Detallesmovimiento;
