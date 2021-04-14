/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { useFormikContext, Field } from 'formik';
import { RadioGroup } from 'formik-material-ui';
import Radio from '@material-ui/core/Radio';
import Tooltip from '@material-ui/core/Tooltip';
import { MoneyFormat } from '../../../utils/TextFieldFormats';

const CobrarForm = (props) => {
  const { open, setAsignarOpen , submitting, setSubmitting} = props;
  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleBlur,
    handleChange,
    resetForm,
  } = useFormikContext();

  const NoDeArticulos = values.articulos.reduce((acc, cur) => {
    return acc + cur.cantidad;
  }, 0);

  const total = values.articulos.reduce((acc, cur) => {
    return acc + cur.precio * cur.cantidad;
  }, 0);

  const handleClose = () => {
    setAsignarOpen(false);
  };

  const handleCobrar = () => {
    setAsignarOpen(false);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <Box width={400}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {values.cliente !== '' && (
                <Typography variant="subtitle1">
                  {`Cliente: ${values.cliente.nombre}`}
                </Typography>
              )}
              <Typography variant="subtitle1">
                {`Total: ${Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(total)}`}
              </Typography>
              <Typography variant="subtitle1">
                {`Número de artículos  : ${NoDeArticulos}`}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Field component={RadioGroup} name="tipoDePago">
                <FormControlLabel
                  control={<Radio disabled={submitting} />}
                  disabled={submitting}
                  label="Efectivo"
                  value="efectivo"
                />
                {values.cliente !== '' && (
                  <FormControlLabel
                    control={<Radio disabled={submitting} />}
                    disabled={submitting}
                    label="Dejar pago pendiente"
                    value="pendiente"
                  />
                )}
              </Field>
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoFocus
                defaultValue={
                  values.cantidadPagada === 0 ? total : values.cantidadPagada
                }
                error={touched.cantidadPagada && errors.cantidadPagada}
                fullWidth
                helperText={touched.cantidadPagada && errors.cantidadPagada}
                id="cantidadPagada"
                InputProps={{
                  inputComponent: MoneyFormat,
                }}
                inputProps={{ maxLength: 11 }}
                label="Cantidad pagada"
                name="cantidadPagada"
                onBlur={(e) => {
                  let { value } = e.target;
                  value = parseFloat(value.replace(/[,$]+/g, '')) || 0;
                  setFieldValue('cantidadPagada', value, false);
                }}
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
            <Grid item xs={12}>
              <Field component={RadioGroup} name="tipoDeImpresion">
                <FormControlLabel
                  control={<Radio disabled={submitting} />}
                  disabled={submitting}
                  label="Cobrar e imprimir"
                  value="imprimir"
                />
                <FormControlLabel
                  control={<Radio disabled={submitting} />}
                  disabled={submitting}
                  label="Cobrar solo registrando la venta"
                  value="noImprimir"
                />
              </Field>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Tooltip title="ESC">
            <Button color="default" onClick={handleClose} size="small">
              Cancelar
            </Button>
          </Tooltip>
          <Button
            color="primary"
            disabled={submitting}
            onClick={handleCobrar}
            size="small"
            variant="outlined"
          >
            Cobrar
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CobrarForm;
