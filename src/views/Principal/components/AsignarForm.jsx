/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { useFormikContext } from 'formik';
import Tooltip from '@material-ui/core/Tooltip';

const AsignarForm = (props) => {
  const { open, setAsignarOpen, clientes } = props;
  const { values, errors, touched, setFieldValue } = useFormikContext();

  const handleClose = () => {
    setAsignarOpen(false);
    setFieldValue('cliente', '', false);
  };

  const handleAsignar = () => {
    setAsignarOpen(false);
  };
  return (
    <Dialog onClose={handleClose} open={open}>
      <Box width={400}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                autoHighlight
                disableClearable
                getOptionLabel={(option) => {
                  if (option) {
                    return `${option.nombre}`;
                  }
                  return '';
                }}
                id="cliente"
                name="cliente"
                onChange={(e, value) => {
                  setFieldValue('cliente', value !== null ? value : '', false);
                }}
                options={clientes}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    autoFocus
                    error={errors.cliente && touched.cliente}
                    helperText={
                      errors.cliente && touched.cliente ? errors.cliente : ''
                    }
                    label="Cliente"
                    margin="dense"
                    name="cliente"
                    size="small"
                    variant="outlined"
                  />
                )}
                value={values.cliente}
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
          <Button
            color="primary"
            disabled={values.cliente === ''}
            onClick={handleAsignar}
            size="small"
            variant="outlined"
          >
            Asignar
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AsignarForm;
