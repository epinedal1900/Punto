/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable import/no-cycle */
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
import { Formik, Field, FormikHelpers } from 'formik';
import { useSelector } from 'react-redux';
import { RadioGroup } from 'formik-material-ui';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ObjectId from 'bson-objectid';
import { RxDocument } from 'rxdb';

import { MoneyFormat } from '../../../utils/TextFieldFormats';
import { NUEVO_GASTO } from '../../../utils/mutations';
import { PLAZA } from '../../../utils/queries';
import { RootState } from '../../../types/store';
import { GastoValues, SetState } from '../../../types/types';
import { NuevoGasto, NuevoGastoVariables } from '../../../types/apollo';
import * as Database from '../../../Database';
import { fechaPorId } from '../../../utils/functions';

const validationSchema = yup.object({
  tipoDeGasto: yup.string(),
  monto: yup.number().required('requerido').min(1, 'requerido'),
  especificar: yup.string().when('tipoDeGasto', {
    is: 'otro',
    then: yup.string().required('requerido'),
  }),
});

interface NuevoGastoProps {
  open: boolean;
  setDialogOpen: SetState<boolean>;
  setGastoOpen: SetState<boolean>;
  setMessage: SetState<string | null>;
  setSuccess: SetState<boolean>;
  mutationVariablesDoc: RxDocument<Database.mutation_variables>;
  plazaDoc: RxDocument<Database.plazaDB>;
}
const GastoForm = (props: NuevoGastoProps): JSX.Element => {
  const {
    open,
    setDialogOpen,
    setGastoOpen,
    setMessage,
    setSuccess,
    mutationVariablesDoc,
    plazaDoc,
  } = props;
  const plazaState = useSelector((state: RootState) => state.plaza);

  const [nuevoGasto, { loading }] = useMutation<
    NuevoGasto,
    NuevoGastoVariables
  >(NUEVO_GASTO, {
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
        query: PLAZA,
        variables: { _id: plazaState._idPunto },
      },
    ],
  });

  const handleClose = () => {
    setDialogOpen(false);
    setGastoOpen(false);
  };

  const handleSubmit = async (
    values: GastoValues,
    actions: FormikHelpers<GastoValues>
  ) => {
    if (plazaState._idPunto) {
      let descripcion = values.tipoDeGasto;
      if (values.tipoDeGasto === 'otro') {
        descripcion = values.especificar;
      } else if (values.tipoDeGasto === 'ingreso') {
        descripcion = 'ingreso de efectivo';
      }
      const _id = new ObjectId();
      const variables: NuevoGastoVariables = {
        _id: _id.toString(),
        gasto: {
          de: descripcion,
          mo: values.monto,
        },
        puntoId: plazaState._idPunto,
      };
      if (plazaState.online) {
        await nuevoGasto({
          variables,
        }).then((res) => {
          if (res.data && res.data.nuevoGasto.success === true) {
            actions.resetForm();
            setDialogOpen(false);
            setGastoOpen(false);
          }
        });
      } else {
        await mutationVariablesDoc.atomicUpdate((oldData) => {
          oldData.gasto?.push(variables);
          return oldData;
        });
        await plazaDoc.atomicUpdate((oldData) => {
          oldData.gastos?.unshift({
            _id: _id.toString(),
            Fecha: fechaPorId(_id),
            Descripcion: `sin conexión: ${descripcion}`,
            Monto: values.monto,
          });
          return oldData;
        });
        actions.resetForm();
        setDialogOpen(false);
        setGastoOpen(false);
        setMessage('Gasto añadido');
        setSuccess(true);
      }
    }
  };

  return (
    <Dialog fullWidth onClose={handleClose} open={open}>
      <Formik<GastoValues>
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
                      control={<Radio disabled={formikProps.isSubmitting} />}
                      disabled={formikProps.isSubmitting}
                      label="Gasolina"
                      value="gasolina"
                    />
                    <FormControlLabel
                      control={<Radio disabled={formikProps.isSubmitting} />}
                      disabled={formikProps.isSubmitting}
                      label="Casetas"
                      value="casetas"
                    />
                    <FormControlLabel
                      control={<Radio disabled={formikProps.isSubmitting} />}
                      disabled={formikProps.isSubmitting}
                      label="Comida"
                      value="comida"
                    />
                    <FormControlLabel
                      control={<Radio disabled={formikProps.isSubmitting} />}
                      disabled={formikProps.isSubmitting}
                      label="Ingreso de efectivo"
                      value="ingreso"
                    />
                    <FormControlLabel
                      control={<Radio disabled={formikProps.isSubmitting} />}
                      disabled={formikProps.isSubmitting}
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
                      Boolean(formikProps.touched.monto) &&
                      Boolean(formikProps.errors.monto)
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

export default GastoForm;
