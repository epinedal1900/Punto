/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { CardContent } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import { Formik } from 'formik';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useMutation } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import { RxDocument } from 'rxdb';
import { useSelector } from 'react-redux';

import { SuccessErrorMessage } from '../../../components';
import { NUEVO_REGISTRO_DE_INVENTARIO } from '../../../utils/mutations';
import {
  nuevoRegistroDeInventario,
  nuevoRegistroDeInventarioVariables,
  PrendasNuevoRegistro,
} from '../../../types/apollo';
import { ArticulosValues } from '../../../types/types';
import * as Database from '../../../Database';
import { Theme } from '../../../theme';
import { RootState } from '../../../types/store';
import { restablecerRegistroInventario } from '../../../utils/functions';
import { ArticulosInitialValues } from '../../../utils/Constants';

interface StepperFormProps {
  steps: { [x: string]: JSX.Element };
  validationSchema: any;
  discrepancias: PrendasNuevoRegistro[];
  nuevoInventario: PrendasNuevoRegistro[];
  loading: boolean;
  doc: RxDocument<Database.registroInventarioDB> | null;
}

const useStyles = makeStyles((theme: Theme) => ({
  content: {
    padding: 0,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
}));

const StepperForm = (props: StepperFormProps): JSX.Element => {
  const classes = useStyles();
  const {
    steps,
    validationSchema,
    discrepancias,
    nuevoInventario,
    loading,
    doc,
  } = props;
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [esperaResumen, setEsperaResumen] = useState(false);
  const plazaState = useSelector((state: RootState) => state.plaza);
  const session = useSelector((state: RootState) => state.session);

  const [
    nuevoRegistroDeInventarioF,
    { loading: nuevoRegistroDeInventarioLoading },
  ] = useMutation<
    nuevoRegistroDeInventario,
    nuevoRegistroDeInventarioVariables
  >(NUEVO_REGISTRO_DE_INVENTARIO, {
    onCompleted: (data) => {
      if (data.nuevoRegistroDeInventario.success === true) {
        setMessage(data.nuevoRegistroDeInventario.message);
        setSuccess(true);
        setActiveStep(0);
      } else {
        setMessage(data.nuevoRegistroDeInventario.message);
      }
    },
    onError: (error) => {
      setMessage(JSON.stringify(error, null, 4));
    },
  });

  const lastStep = Object.keys(steps).length - 1;
  const onSubmit = async (_values: any, actions: any) => {
    if (activeStep === lastStep && doc) {
      if (plazaState.idInventario && session.nombre) {
        await nuevoRegistroDeInventarioF({
          variables: {
            articulos: nuevoInventario,
            discrepancias,
            _id: plazaState.idInventario,
            nombre: session.nombre,
          },
        }).then(async (res) => {
          if (res.data && res.data.nuevoRegistroDeInventario.success === true) {
            actions.resetForm();
            await restablecerRegistroInventario(doc);
          }
        });
      }
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
    } else {
      setEsperaResumen(false);
    }
  }, [activeStep]);

  const handleExit = () => {
    setSuccess(false);
    setMessage(null);
    window.location.reload();
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const schema = validationSchema[activeStep];

  return (
    <Formik<ArticulosValues>
      initialValues={ArticulosInitialValues}
      onSubmit={onSubmit}
      validateOnBlur={false}
      validateOnChange={false}
      validationSchema={schema}
    >
      {(formikProps) => (
        <Card elevation={4}>
          <CardContent className={classes.content}>
            <form onSubmit={formikProps.handleSubmit}>
              <Box>{React.cloneElement(steps[activeStep])}</Box>
              {formikProps.isSubmitting && (
                <Box>
                  <LinearProgress />
                </Box>
              )}
              <Box display="flex" flexDirection="row-reverse" m={1} p={1}>
                <Button
                  color={formikProps.isValid ? 'primary' : 'default'}
                  disabled={
                    formikProps.isSubmitting ||
                    esperaResumen ||
                    loading ||
                    (formikProps.values.escaneos.length === 0 &&
                      formikProps.values.prendasSueltas.length === 0)
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
                      nuevoRegistroDeInventarioLoading
                    }
                    onClick={handleBack}
                  >
                    Atras
                  </Button>
                )}
              </Box>
              <SuccessErrorMessage
                handleExit={handleExit}
                message={message}
                success={success}
              />
            </form>
          </CardContent>
        </Card>
      )}
    </Formik>
  );
};

export default StepperForm;
