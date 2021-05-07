/* eslint-disable promise/always-return */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import { useQuery, useMutation } from '@apollo/client';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import groupBy from 'lodash/groupBy';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';

import { AuthGuard, Header } from '../../components';
import Articulos from '../../formPartials/Articulos';
import { NUEVO_REGISTRO_INVENTARIO_UTILS } from '../../utils/queries';
import { REGISTRAR_DISCREPANCIAS } from '../../utils/mutations';
import { guardarInventario } from '../../actions/sessionActions';
import validationSchema from './components/validationSchema';
import Resumen from './components/Resumen';
import StepperForm from './components/StepperForm';

const NuevaSalidaMercancia = () => {
  const session = useSelector((state) => state.session);
  const history = useHistory();
  const dispatch = useDispatch();
  const initialValues = {
    tipoDeMovimiento: 'salida',
    puntoId: '',
    articulos: session.inventario,
    comentarios: '',
  };
  const [articulos, setArticulos] = useState([]);
  const [inventario, setInventario] = useState(null);
  const [discrepancias, setDiscrepancias] = useState(null);
  const [disabled, setDisabled] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState(null);

  useQuery(NUEVO_REGISTRO_INVENTARIO_UTILS, {
    variables: {
      _idProductos: 'productos',
      nombre: session.nombre,
    },
    onCompleted: (data) => {
      setDisabled(
        Math.abs(dayjs().diff(dayjs(data.inventario.fecha), 'day', true)) <= 1
      );
      setInventario(
        data.inventario.inventario.map((val) => {
          // eslint-disable-next-line radix
          return { articulo: val.articulo, cantidad: parseInt(val.cantidad) };
        })
      );
      setArticulos(data.productos.objects);
      setLoading(false);
    },
    fetchPolicy: 'network-only',
  });
  useEffect(() => {
    if (!session.online) {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.online]);

  const steps = {
    '0': (
      <Articulos
        articuloFreeSolo={false}
        incluirPrecio={false}
        maxRows={50}
        opcionesArticulos={articulos}
      />
    ),
    '1': (
      <Resumen
        discrepancias={discrepancias}
        inventario={inventario}
        setDiscrepancias={setDiscrepancias}
      />
    ),
  };

  const [
    registrarDiscrepancias,
    { loading: registrarDiscrepanciasLoading },
  ] = useMutation(REGISTRAR_DISCREPANCIAS, {
    onCompleted: (data) => {
      if (data.registrarDiscrepancias.success === true) {
        setMessage(data.registrarDiscrepancias.message);
        setSuccess(true);
        setActiveStep(0);
      } else {
        setMessage(data.registrarDiscrepancias.message);
      }
    },
    onError: (error) => {
      setMessage(JSON.stringify(error, null, 4));
    },
  });

  const lastStep = Object.keys(steps).length - 1;

  const onSubmit = async (values, actions) => {
    if (activeStep === lastStep) {
      const articulosObj = values.articulos.map((val) => {
        return { articulo: val.articulo.nombre, cantidad: val.cantidad };
      });
      const obj = groupBy(articulosObj, 'articulo');
      const prendasAgrupadas = Object.keys(obj).map((key) => {
        return {
          articulo: key,
          cantidad: obj[key].reduce((acc, cur) => {
            return acc + cur.cantidad;
          }, 0),
        };
      });
      await registrarDiscrepancias({
        variables: {
          articulos: discrepancias,
          puntoId: session.puntoIdActivo,
          tipo: 'inventario',
          nombre: session.nombre,
          sobrescribir: prendasAgrupadas,
        },
      }).then((res) => {
        if (res.data.registrarDiscrepancias.success === true) {
          setDisabled(true);
          actions.resetForm();
          dispatch(
            guardarInventario({ inventario: [{ articulo: '', cantidad: 0 }] })
          );
        }
      });
    } else {
      setActiveStep(activeStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  };

  const schema = validationSchema[activeStep];

  const handleExit = () => {
    setSuccess(null);
    setMessage(null);
  };

  return (
    <AuthGuard denyReadOnly roles={['ADMIN', 'PUNTO']}>
      <Header titulo="Registro de inventario" />
      <Box display="flex" justifyContent="center" m={0}>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validateOnBlur={false}
          validateOnChange={false}
          validationSchema={schema}
        >
          {(formikProps) => (
            <StepperForm
              activeStep={activeStep}
              disabled={disabled}
              formikProps={formikProps}
              handleExit={handleExit}
              lastStep={lastStep}
              loading={loading}
              message={message}
              registrarDiscrepanciasLoading={registrarDiscrepanciasLoading}
              setActiveStep={setActiveStep}
              steps={steps}
              success={success}
            />
          )}
        </Formik>
      </Box>
    </AuthGuard>
  );
};

export default NuevaSalidaMercancia;
