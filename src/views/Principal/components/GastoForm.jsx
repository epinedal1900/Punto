/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable promise/always-return */
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { useMutation } from '@apollo/client';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import * as yup from 'yup';
import { Formik, Field } from 'formik';
import { useSelector } from 'react-redux';
import { RadioGroup } from 'formik-material-ui';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { MoneyFormat } from '../../../utils/TextFieldFormats';
import { NUEVO_GASTO } from '../../../utils/mutations';
import { MOVIMIENTOS } from '../../../utils/queries';

const validationSchema = yup.object({
  tipoDeGasto: yup.string(),
  monto: yup.number().required('requerido').min(1, 'requerido'),
  especificar: yup.string().when('tipoDeGasto', {
    is: 'otro',
    then: yup.string().required('requerido'),
  }),
});

const NuevoGasto = (props) => {
  const { open, setDialogOpen, setGastoOpen, setMessage, setSuccess } = props;
  const session = useSelector((state) => state.session);

  const [nuevoGasto, { loading }] = useMutation(NUEVO_GASTO, {
    onCompleted: (data) => {
      if (data.nuevoGasto.success === true) {
        setMessage(data.nuevoGasto.message);
        setSuccess(true);
      } else {
        setMessage(data.nuevoGasto.message);
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

  const handleClose = () => {
    setDialogOpen(false);
    setGastoOpen(false);
  };

  const handleSubmit = async (values, actions) => {
    const obj = {
      descripcion:
        values.tipoDeGasto === 'otro' ? values.especificar : values.tipoDeGasto,
      monto: values.monto,
    };
    await nuevoGasto({
      variables: {
        obj,
        puntoId: session.puntoIdActivo,
      },
    }).then((res) => {
      if (res.data.nuevoGasto.success === true) {
        actions.resetForm();
        setDialogOpen(false);
        setGastoOpen(false);
      }
    });
  };

  return (
    <Dialog fullWidth onClose={handleClose} open={open}>
      <Formik
        initialValues={{
          tipoDeGasto: 'gasolina',
          especificar: '',
          monto: 0,
        }}
        onSubmit={handleSubmit}
        validateOnBlur={false}
        validateOnChange={false}
        validationSchema={validationSchema}
      >
        {(formikProps) => (
          <form onSubmit={formikProps.handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Nuevo gasto</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Field component={RadioGroup} name="tipoDeGasto">
                    <FormControlLabel
                      control={<Radio disabled={formikProps.submitting} />}
                      disabled={formikProps.submitting}
                      label="Gasolina"
                      value="gasolina"
                    />
                    <FormControlLabel
                      control={<Radio disabled={formikProps.submitting} />}
                      disabled={formikProps.submitting}
                      label="Casetas"
                      value="casetas"
                    />
                    <FormControlLabel
                      control={<Radio disabled={formikProps.submitting} />}
                      disabled={formikProps.submitting}
                      label="Comida"
                      value="comida"
                    />
                    <FormControlLabel
                      control={<Radio disabled={formikProps.submitting} />}
                      disabled={formikProps.submitting}
                      label="Otro"
                      value="otro"
                    />
                  </Field>
                </Grid>
                {formikProps.values.tipoDeGasto === 'otro' && (
                  <Grid item xs={12}>
                    <TextField
                      error={
                        formikProps.touched.especificar &&
                        Boolean(formikProps.errors.especificar)
                      }
                      fullWidth
                      helperText={
                        formikProps.touched.especificar &&
                        formikProps.errors.especificar
                      }
                      id="especificar"
                      label="Especificar"
                      multiline
                      name="especificar"
                      onBlur={formikProps.handleBlur}
                      onChange={formikProps.handleChange}
                      value={formikProps.values.especificar}
                      variant="outlined"
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <TextField
                    error={
                      formikProps.touched.monto && formikProps.errors.monto
                    }
                    fullWidth
                    helperText={
                      formikProps.touched.monto && formikProps.errors.monto
                    }
                    id="monto"
                    InputProps={{
                      inputComponent: MoneyFormat,
                    }}
                    inputProps={{ maxLength: 11 }}
                    label="Monto"
                    name="monto"
                    onChange={(e) => {
                      const { value } = e.target;
                      const nuevoValue =
                        parseFloat(value.replace(/[,$]+/g, '')) || 0;
                      formikProps.setFieldValue('monto', nuevoValue, false);
                    }}
                    onFocus={(event) => {
                      event.target.select();
                    }}
                    value={
                      formikProps.values.monto === 0
                        ? ''
                        : formikProps.values.monto
                    }
                    variant="outlined"
                  />
                  {/* <h2>{JSON.stringify(formikProps.values)}</h2> */}
                </Grid>
                {(loading || formikProps.isSubmitting) && (
                  <Grid item xs={12}>
                    <LinearProgress />
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                color="default"
                disabled={formikProps.isSubmitting}
                onClick={handleClose}
                size="small"
              >
                Cancelar
              </Button>
              <Button
                autoFocus
                color="primary"
                disabled={formikProps.isSubmitting}
                size="small"
                type="submit"
                variant="contained"
              >
                Añadir
              </Button>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default NuevoGasto;
