/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { Formik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { useMutation } from '@apollo/client';
import { useSelector } from 'react-redux';
import ObjectId from 'bson-objectid';
import { RxDocument } from 'rxdb';

import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { AutocompleteField } from '../../../components';
import { RootState } from '../../../types/store';
import { MoneyFormat } from '../../../utils/TextFieldFormats';
import * as Database from '../../../Database';
import { NUEVO_PAGO } from '../../../utils/mutations';
import { PagoValues, SetState } from '../../../types/types';
import {
  nuevoPago,
  NuevoPagoUtils_clientes,
  nuevoPagoVariables,
  TipoDePago,
} from '../../../types/apollo';
import { PLAZA } from '../../../utils/queries';
import { fechaPorId } from '../../../utils/functions';

const validationSchema = yup.object({
  cliente: yup.object().required('requerido'),
  monto: yup.number().min(1, 'requerido').required('requerido'),
  comentarios: yup.string(),
});
interface NuevoPagoProps {
  clientes: NuevoPagoUtils_clientes[];
  setMessage: SetState<string | null>;
  setSuccess: SetState<boolean>;
  setDialogOpen: SetState<boolean>;
  setPagoOpen: SetState<boolean>;
  open: boolean;
  plazaDoc: RxDocument<Database.plazaDB>;
  mutationVariablesDoc: RxDocument<Database.mutation_variables>;
}

const NuevoPagoComponent = (props: NuevoPagoProps): JSX.Element => {
  const {
    clientes,
    setMessage,
    setSuccess,
    setDialogOpen,
    setPagoOpen,
    open,
    mutationVariablesDoc,
    plazaDoc,
  } = props;
  const plazaState = useSelector((state: RootState) => state.plaza);

  const [nuevoPagoFunction] = useMutation<nuevoPago, nuevoPagoVariables>(
    NUEVO_PAGO,
    {
      onCompleted: (data) => {
        if (data.nuevoPago.success === true) {
          setMessage(data.nuevoPago.message);
          setSuccess(true);
          setDialogOpen(false);
          setPagoOpen(false);
        } else {
          setMessage(data.nuevoPago.message);
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
    }
  );

  const handleAgregar = async (
    values: PagoValues,
    actions: FormikHelpers<PagoValues>
  ) => {
    const { cliente } = values;
    if (cliente !== '' && plazaState._idPunto) {
      const _id = new ObjectId();
      const variables: nuevoPagoVariables = {
        _id: _id.toString(),
        nombre: cliente.nombre,
        obj: {
          cl: cliente._id,
          ti: TipoDePago.efectivo,
          mo: values.monto,
          co: values.comentarios,
        },
        puntoId: plazaState._idPunto,
      };
      if (plazaState.online) {
        await nuevoPagoFunction({
          variables,
        }).then((res) => {
          if (res.data && res.data.nuevoPago.success === true) {
            actions.resetForm();
          }
        });
      } else {
        await mutationVariablesDoc.atomicUpdate((oldData) => {
          oldData.pago.push(variables);
          return oldData;
        });
        await plazaDoc.atomicUpdate((oldData) => {
          oldData.pagos?.unshift({
            _id: _id.toString(),
            cliente: cliente._id,
            Fecha: fechaPorId(_id),
            Nombre: `sin conexión: ${cliente.nombre}`,
            Tipo: 'efectivo',
            Monto: values.monto,
            Comentarios: values.comentarios,
            ca: false,
          });
          return oldData;
        });
        actions.resetForm();
        setMessage('Pago añadido');
        setSuccess(true);
        setDialogOpen(false);
        setPagoOpen(false);
      }
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    setPagoOpen(false);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <Formik<PagoValues>
        initialValues={{
          cliente: '',
          monto: 0,
          comentarios: '',
        }}
        onSubmit={handleAgregar}
        validateOnBlur={false}
        validateOnChange={false}
        validationSchema={validationSchema}
      >
        {({
          errors,
          values,
          handleSubmit,
          isSubmitting,
          handleBlur,
          handleChange,
          touched,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Pago en efectivo</Typography>
                </Grid>
                <Grid item xs={12}>
                  <AutocompleteField
                    getOptionsLabel={(option) =>
                      option.nombre ? option.nombre : ''
                    }
                    label="Cliente"
                    options={clientes}
                    valueName="cliente"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={Boolean(touched.monto) && Boolean(errors.monto)}
                    fullWidth
                    helperText={touched.monto && errors.monto}
                    id="monto"
                    InputProps={{
                      inputComponent: MoneyFormat,
                    }}
                    inputProps={{ maxLength: 11 }}
                    label="Monto"
                    name="monto"
                    onBlur={(e) => {
                      const { value } = e.target;
                      const newValue =
                        parseFloat(value.replace(/[,$]+/g, '')) || 0;
                      setFieldValue('monto', newValue, false);
                    }}
                    value={values.monto === 0 ? '' : values.monto}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={touched.comentarios && Boolean(errors.comentarios)}
                    fullWidth
                    helperText={touched.comentarios && errors.comentarios}
                    id="comentarios"
                    label="Comentarios"
                    multiline
                    name="comentarios"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.comentarios}
                    variant="outlined"
                  />
                </Grid>
                {isSubmitting && (
                  <Grid item xs={12}>
                    <LinearProgress />
                  </Grid>
                )}
              </Grid>
              {/* <h2>{JSON.stringify(values)}</h2> */}
            </DialogContent>
            <DialogActions>
              <Button
                color="default"
                disabled={isSubmitting}
                onClick={handleClose}
                size="small"
              >
                Cancelar
              </Button>
              <Button
                autoFocus
                color="primary"
                disabled={isSubmitting}
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

export default NuevoPagoComponent;
