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
import { ClienteForm, PrincipalValues } from 'types/types';

interface AsignarFormProps {
  open: boolean;
  setAsignarOpen: (a: any) => void;
  clientes: ClienteForm[];
  setDialogOpen: (a: any) => void;
}
const AsignarForm = (props: AsignarFormProps): JSX.Element => {
  const { open, setAsignarOpen, clientes, setDialogOpen } = props;
  const { values, errors, touched, setFieldValue } = useFormikContext<
    PrincipalValues
  >();

  const handleClose = () => {
    setDialogOpen(false);
    setAsignarOpen(false);
    setFieldValue('cliente', '', false);
  };

  const handleAsignar = () => {
    setDialogOpen(false);
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
                onChange={(_e, value) => {
                  setFieldValue('cliente', value !== null ? value : '', false);
                }}
                options={clientes}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    autoFocus
                    error={Boolean(errors.cliente) && Boolean(touched.cliente)}
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
                // @ts-expect-error: error
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
