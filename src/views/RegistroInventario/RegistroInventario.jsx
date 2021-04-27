/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import { useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';

import { NUEVO_REGISTRO_INVENTARIO_UTILS } from '../../utils/queries';
import Articulos from '../../formPartials/Articulos';
import { AuthGuard, Header } from '../../components';
import validationSchema from './components/validationSchema';
import Resumen from './components/Resumen';
import StepperForm from './components/StepperForm';

const RegistroInventario = () => {
  const initialValues = {
    tipoDeMovimiento: 'salida',
    puntoId: '',
    articulos: [{ articulo: '', cantidad: 0 }],
    comentarios: '',
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formValues, setFormValues] = useState(
    JSON.parse(JSON.stringify(initialValues))
  );
  const [inventario, setInventario] = useState(null);
  const [articulos, setArticulos] = useState([]);
  const session = useSelector((state) => state.session);

  useQuery(NUEVO_REGISTRO_INVENTARIO_UTILS, {
    variables: {
      _idProductos: 'productos',
      nombre: session.nombre,
    },
    onCompleted: (data) => {
      setInventario(data.inventario);
      setArticulos(data.productos.objects);
    },
  });

  const clearOnSubmit = (actions) => {
    actions.resetForm({ values: JSON.parse(JSON.stringify(initialValues)) });
  };

  const steps = {
    '0': (
      <Articulos
        articuloFreeSolo={false}
        incluirPrecio={false}
        maxRows={50}
        opcionesArticulos={articulos}
        // eslint-disable-next-line react/jsx-closing-bracket-location
      />
    ),
    '1': <Resumen inventario={inventario} />,
  };

  return (
    <AuthGuard denyReadOnly roles={['ADMIN', 'PUNTO']}>
      <Header titulo="Registro de inventarío" />
      <Box display="flex" justifyContent="center" m={0}>
        <StepperForm
          clearOnSubmit={clearOnSubmit}
          formValues={formValues}
          steps={steps}
          validationSchema={validationSchema}
        />
      </Box>
    </AuthGuard>
  );
};

export default RegistroInventario;
