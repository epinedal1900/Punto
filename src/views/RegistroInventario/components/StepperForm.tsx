import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { CardContent } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useSelector, useDispatch } from 'react-redux';
import { useFormikContext } from 'formik';

import { SuccessErrorMessage } from '../../../components';
import { guardarInventario } from '../../../actions/sessionActions';
import { RootState } from '../../../types/store';
import { ArticuloForm, Session } from '../../../types/types';

interface StepperFormProps {
  StepA: JSX.Element;
  StepB: JSX.Element;
  disabled: boolean;
  loading: boolean;
  lastStep: number;
  activeStep: number;
  setActiveStep: (a: number) => void;
  success: boolean;
  message: string | null;
  handleExit: () => void;
  registrarDiscrepanciasLoading: boolean;
}
const StepperForm = (props: StepperFormProps): JSX.Element => {
  const {
    StepA,
    StepB,
    disabled,
    loading,
    lastStep,
    activeStep,
    setActiveStep,
    success,
    message,
    handleExit,
    registrarDiscrepanciasLoading,
  } = props;

  const formikProps = useFormikContext<{ articulos: ArticuloForm[] }>();
  const [esperaResumen, setEsperaResumen] = useState(false);
  const dispatch = useDispatch();
  const session: Session = useSelector((state: RootState) => state.session);

  useEffect(() => {
    return () => {
      dispatch(guardarInventario({ inventario: formikProps.values.articulos }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formikProps.values]);

  useEffect(() => {
    const bloquearSubmit = async () => {
      setEsperaResumen(true);
      await new Promise((resolve) => setTimeout(resolve, 10000));
      setEsperaResumen(false);
    };
    if (activeStep === lastStep) {
      bloquearSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep]);

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <Box minHeight={500} width={800}>
      <Card>
        <CardContent>
          <form onSubmit={formikProps.handleSubmit}>
            {activeStep === 0 && React.cloneElement(StepA)}
            {activeStep === 1 && React.cloneElement(StepB)}
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
                  disabled ||
                  loading ||
                  !session.online
                }
                type="submit"
                variant="contained"
              >
                {activeStep === lastStep ? 'Finalizar' : 'Siguiente'}
              </Button>
              {activeStep !== 0 && (
                <Button
                  disabled={
                    formikProps.isSubmitting || registrarDiscrepanciasLoading
                  }
                  onClick={handleBack}
                >
                  Atras
                </Button>
              )}
            </Box>
            <SuccessErrorMessage
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              handleExit={handleExit}
              message={message}
              success={success}
            />
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StepperForm;
