/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { GlobalHotKeys } from 'react-hotkeys';
import Box from '@material-ui/core/Box';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { useFormikContext, getIn } from 'formik';
import * as yup from 'yup';
import Tooltip from '@material-ui/core/Tooltip';
import { MoneyFormat, IntegerFormat } from '../utils/TextFieldFormats';

const AgregarForm = (props) => {
  const {
    open,
    handleAddClose,
    setAgregarOpen,
    opcionesArticulos,
    arrayHelpers,
  } = props;
  const { values, errors, touched, setFieldValue } = useFormikContext();

  const handleClose = () => {
    setAgregarOpen(false);
  };

  const handleAgregar = () => {
    if (values.articulos.length < 20) {
      arrayHelpers.insert(0, {
        articulo: values.articulo,
        cantidad: values.cantidad,
        precio: values.precio,
      });
      setFieldValue('articulo', '', false);
      setFieldValue('cantidad', 0, false);
      setFieldValue('precio', 0, false);
      setAgregarOpen(false);
    }
  };
  const keyMap = {
    AGREGAR_CLICK: 'ctrl+enter',
  };

  const handlers = {
    AGREGAR_CLICK: handleAgregar,
  };

  return (
    <GlobalHotKeys allowChanges handlers={handlers} keyMap={keyMap}>
      <Dialog onClose={handleAddClose} open={open}>
        <Box maxWidth={400}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  error={errors.cantidad && touched.cantidad}
                  helperText={
                    errors.cantidad && touched.cantidad ? errors.cantidad : ''
                  }
                  id="cantidad"
                  InputProps={{ inputComponent: IntegerFormat }}
                  inputProps={{ maxLength: 7 }}
                  label="Cantidad"
                  margin="dense"
                  name="cantidad"
                  onBlur={(e) => {
                    const val =
                      parseFloat(e.target.value.replace(/[,$]+/g, '')) || 0;
                    setFieldValue('cantidad', val, false);
                  }}
                  size="small"
                  value={values.cantidad > 0 ? values.cantidad : ''}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  autoHighlight
                  disableClearable
                  getOptionLabel={(option) => {
                    if (option) {
                      return `${option.codigo}: ${option.nombre}`;
                    }
                    return '';
                  }}
                  id="articulo"
                  name="articulo"
                  onChange={(e, value) => {
                    setFieldValue(
                      'articulo',
                      value !== null ? value : '',
                      false
                    );
                    if (typeof value === 'object' && value !== null) {
                      setFieldValue('precio', value.precio, false);
                    }
                  }}
                  options={opcionesArticulos}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={errors.articulo && touched.articulo}
                      helperText={
                        errors.articulo && touched.articulo
                          ? errors.articulo
                          : ''
                      }
                      label="Artículo"
                      margin="dense"
                      name="articulo"
                      size="small"
                      variant="outlined"
                    />
                  )}
                  value={values.articulo}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  // defaultValue={value > 0 ? value : ''}
                  error={errors.precio && touched.precio}
                  helperText={
                    errors.precio && touched.precio ? errors.precio : ''
                  }
                  id="precio"
                  InputProps={{ inputComponent: MoneyFormat }}
                  inputProps={{ maxLength: 7 }}
                  label="Precio"
                  margin="dense"
                  name="precio"
                  onBlur={(e) => {
                    const val =
                      parseFloat(e.target.value.replace(/[,$]+/g, '')) || 0;
                    setFieldValue('precio', val, false);
                  }}
                  size="small"
                  value={values.precio > 0 ? values.precio : ''}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Tooltip title="ESC">
              <Button color="default" onClick={handleClose} size="small">
                Cancelar
              </Button>
            </Tooltip>

            <Tooltip title="CTRL+ENTER">
              <Button
                color="primary"
                disabled={values.articulos.length > 15}
                onClick={handleAgregar}
                size="small"
                variant="outlined"
              >
                Agregar
              </Button>
            </Tooltip>
          </DialogActions>
        </Box>
      </Dialog>
    </GlobalHotKeys>
  );
};

export default AgregarForm;
