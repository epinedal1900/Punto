/* eslint-disable func-names */
/* eslint-disable promise/always-return */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { CardContent } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import { Formik } from 'formik';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useMutation } from '@apollo/client';
import { assign } from 'lodash';
import groupBy from 'lodash/groupBy';

import { SuccessErrorMessage } from '../../../components';
import { CREAR_DISCREPANCIA_INVENTARIO } from '../../../utils/mutations';

const StepperForm = (props) => {
  const { formValues, steps, validationSchema, clearOnSubmit } = props;
  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [esperaResumen, setEsperaResumen] = useState(false);

  const [
    crearDiscrepanciaInventario,
    { loading: crearDiscrepanciaInventarioLoading },
  ] = useMutation(CREAR_DISCREPANCIA_INVENTARIO, {
    onCompleted: (data) => {
      if (data.crearDiscrepanciaInventario.success === true) {
        setMessage(data.crearDiscrepanciaInventario.message);
        setSuccess(true);
        setActiveStep(0);
      } else {
        setMessage(data.crearDiscrepanciaInventario.message);
      }
    },
    onError: (error) => {
      setMessage(JSON.stringify(error, null, 4));
    },
  });

  const lastStep = Object.keys(steps).length - 1;
  const onSubmit = async (values, actions) => {
    if (activeStep === lastStep) {
      const articulos = values.articulos.map((val) => {
        return { articulo: val.articulo.nombre, cantidad: val.cantidad };
      });
      const prendasAgrupadasObj = groupBy(articulos, 'articulo');
      const prendasAgrupadas = Object.keys(prendasAgrupadasObj).map(function (
        key
      ) {
        return {
          articulo: key,
          cantidad: prendasAgrupadasObj[key].reduce((acc, cur) => {
            return acc + cur.cantidad;
          }, 0),
        };
      });
      const obj = {
        tipo: 'entrada',
        articulos: prendasAgrupadas,
      };
      if (values.comentarios !== '') {
        assign(obj, { comentarios: values.comentarios });
      }
      await crearDiscrepanciaInventario({
        variables: {
          obj,
          puntoId: values.puntoId.id,
          nombre: values.puntoId.nombre,
        },
      }).then((res) => {
        if (res.data.crearDiscrepanciaInventario.success === true) {
          clearOnSubmit(actions);
        }
      });
    } else {
      setActiveStep(activeStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  };

  useEffect(() => {
    const bloquearSubmit = async () => {
      setEsperaResumen(true);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      setEsperaResumen(false);
    };
    if (activeStep === lastStep) {
      bloquearSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep]);

  const handleExit = () => {
    setSuccess(null);
    setMessage(null);
  };
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const schema = validationSchema[activeStep];

  return (
    <Formik
      initialValues={formValues}
      onSubmit={onSubmit}
      validateOnBlur={false}
      validateOnChange={false}
      validationSchema={schema}
    >
      {(formikProps) => (
        <Box minHeight={500} width={800}>
          <Card>
            <CardContent>
              <form onSubmit={formikProps.handleSubmit}>
                <Box>{React.cloneElement(steps[activeStep])}</Box>
                {formikProps.isSubmitting && (
                  <Box>
                    <LinearProgress />
                  </Box>
                )}
                <Box
                  bm={2}
                  display="flex"
                  flexDirection="row-reverse"
                  m={1}
                  p={1}
                >
                  <Button
                    color={formikProps.isValid ? 'primary' : 'default'}
                    disabled={
                      formikProps.isSubmitting ||
                      crearDiscrepanciaInventarioLoading ||
                      esperaResumen
                    }
                    type="submit"
                    variant="contained"
                  >
                    {activeStep === lastStep ? 'Finalizar' : 'Siguiente'}
                  </Button>
                  {activeStep !== 0 && (
                    <Button
                      disabled={
                        formikProps.isSubmitting ||
                        crearDiscrepanciaInventarioLoading
                      }
                      onClick={handleBack}
                    >
                      Atras
                    </Button>
                  )}
                </Box>
                <SuccessErrorMessage
                  anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                  handleExit={handleExit}
                  message={message}
                  success={success}
                />
              </form>
            </CardContent>
          </Card>
        </Box>
      )}
    </Formik>
  );
};

export default StepperForm;
