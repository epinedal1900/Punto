import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useMutation } from '@apollo/client';
import omitBy from 'lodash/omitBy';
import pick from 'lodash/pick';
import valuesIn from 'lodash/valuesIn';
import isEmpty from 'lodash/isEmpty';
import compact from 'lodash/compact';
import assign from 'lodash/assign';
import omit from 'lodash/omit';
import reject from 'lodash/reject';
import LinearProgress from '@material-ui/core/LinearProgress';

import { BlockingContext, TextForm, SuccessErrorMessage } from '../components';
import { Direccion } from '../formPartials/Direccion';

import { NUEVO_CLIENTE } from '../utils/mutations';
import { CLIENTES } from '../utils/queries';
import { DigitsFormat } from '../utils/TextFieldFormats';

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 700,
  },
  fields: {
    margin: theme.spacing(-1),
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      flexGrow: 1,
      margin: theme.spacing(1),
    },
  },
}));

const userValidationSchema = yup.object({
  nombre: yup
    .string()
    .min(3, '3 caracteres mínimo')
    .max(45, '45 caracteres máximo')
    .matches(/^[a-zA-Z\u00f1\u00d1À-ÿ\s]{3,45}$/, 'ingrese un nombre válido')
    .required('Campo requerido'),
  direccion: yup
    .string()
    .min(3, '3 caracteres mínimo')
    .max(45, '45 caracteres máximo'),
  cp: yup.string().matches(/^[0-9]{5}$/, 'ingrese un código postal válido'),
  estado: yup.string(),
  telefono1: yup
    .string()
    .trim()
    .matches(/^[0-9]{10}$/, 'ingrese un teléfono válido'),
  telefono2: yup
    .string()
    .trim()
    .matches(/^[0-9]{10}$/, 'ingrese un teléfono válido'),
  correo: yup.string().trim().email('Ingrese un correo válido'),
});

const NewUserForm = (props) => {
  const {
    handleClose,
    formValues,
    clearOnSubmit,
    setIsBlocking,
    viewPath,
    showAdressForm,
  } = props;
  const classes = useStyles();

  const [success, setSuccess] = useState(null);
  const [id, setId] = useState(null);
  const [nombre, setNombre] = useState(null);
  const [telefono1, setTelefono1] = useState(null);
  const [message, setMessage] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [nuevoCliente, { data, loading, error }] = useMutation(NUEVO_CLIENTE, {
    onCompleted: (data) => {
      if (data.nuevoCliente.success === true) {
        setId(data.nuevoCliente._id);
        setMessage(data.nuevoCliente.message);
        setSuccess(true);
        clearOnSubmit({
          _id: data.nuevoCliente._id,
          Nombre: nombre,
          Telefono: telefono1,
          Balance: 0,
        });
        setIsBlocking(false);
      } else {
        setMessage(data.nuevoCliente.message);
      }
    },
    onError: (error) => {
      setMessage(JSON.stringify(error, null, 4));
    },
    refetchQueries: [
      {
        query: CLIENTES,
      },
    ],
  });

  const handleSubmit = async (values, actions) => {
    let obj;
    setTelefono1(values.telefono1 || '-----');
    setNombre(values.nombre);

    const telefonos = {
      telefonos: compact(
        valuesIn(pick(values, ['telefono1', 'telefono2'])),
        isEmpty
      ),
    };
    const direcciones = omitBy(
      {
        direcciones: reject(
          [omitBy(pick(values, ['direccion', 'cp', 'estado']), isEmpty)],
          isEmpty
        ),
      },
      isEmpty
    );
    if (telefonos.telefonos.length === 0) {
      obj = assign(
        omitBy(
          omit(values, 'telefono1', 'telefono2', 'direccion', 'cp', 'estado'),
          isEmpty
        ),
        direcciones
      );
    } else {
      obj = assign(
        omitBy(
          omit(values, 'telefono1', 'telefono2', 'direccion', 'cp', 'estado'),
          isEmpty
        ),
        telefonos,
        direcciones
      );
    }

    await nuevoCliente({
      variables: { obj },
    }).then((res) => {
      if (res.data.nuevoCliente.success === true) {
        actions.resetForm();
      }
    });
  };

  const handleExit = () => {
    setSuccess(null);
    setId(null);
    setMessage(null);
  };

  const handleCloseClick = (event, data) => {
    handleClose(data);
  };

  return (
    <Formik
      initialValues={formValues}
      onSubmit={handleSubmit}
      validateOnChange={false}
      validationSchema={userValidationSchema}
    >
      {(formikProps) => (
        <form onSubmit={formikProps.handleSubmit}>
          <BlockingContext setIsBlocking={setIsBlocking} />
          <div className={classes.fields}>
            <TextForm icono="persona" lable="Nombre*" value="nombre" />
            <TextForm
              icono="telefono"
              InputProps={{ inputComponent: DigitsFormat }}
              inputProps={{ maxLength: 10 }}
              lable="Teléfono 1"
              value="telefono1"
            />
            <TextForm
              InputProps={{ inputComponent: DigitsFormat }}
              inputProps={{ maxLength: 10 }}
              lable="Teléfono 2"
              value="telefono2"
            />
            <TextForm icono="correo" lable="Correo" value="correo" />
            {showAdressForm && <Direccion />}
            {formikProps.isSubmitting && (
              <Box width="100%">
                <LinearProgress />
              </Box>
            )}
            <Box bm={2} display="flex" flexDirection="row-reverse" m={1} p={1}>
              <Box p={1}>
                <Button
                  color="primary"
                  disabled={formikProps.isSubmitting || (message && !success)}
                  type="submit"
                  variant="contained"
                >
                  Añadir
                </Button>
              </Box>
              <Box p={1}>
                <Button
                  disabled={formikProps.isSubmitting || (message && !success)}
                  onClick={(event) =>
                    handleCloseClick(event, formikProps.values)
                  }
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          </div>
          <SuccessErrorMessage
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            handleExit={handleExit}
            id={id}
            message={message}
            success={success}
            viewPath={viewPath}
          />
        </form>
      )}
    </Formik>
  );
};

export default NewUserForm;
