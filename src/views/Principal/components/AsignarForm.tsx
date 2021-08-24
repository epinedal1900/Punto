import { RxDocument } from 'rxdb';
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
import { PrincipalValues, SetState } from '../../../types/types';
import { NuevaVentaUtils_clientes } from '../../../types/apollo';
import { TicketDb } from '../../../Database';

interface AsignarFormProps {
  open: boolean;
  setAsignarOpen: SetState<boolean>;
  clientes: NuevaVentaUtils_clientes[];
  setDialogOpen: SetState<boolean>;
  docTicket: RxDocument<TicketDb> | null;
}
const AsignarForm = (props: AsignarFormProps): JSX.Element => {
  const { open, setAsignarOpen, clientes, setDialogOpen, docTicket } = props;
  const { values, errors, touched, setFieldValue } = useFormikContext<
    PrincipalValues
  >();

  const handleClose = async () => {
    setDialogOpen(false);
    setAsignarOpen(false);
    await docTicket?.atomicUpdate((o) => {
      o.cliente = '';
      o.tipoDePago = 'efectivo';
      return o;
    });
    setFieldValue('cliente', '', false);
    setFieldValue('tipoDePago', 'efectivo', false);
  };

  const handleAsignar = async () => {
    setDialogOpen(false);
    setAsignarOpen(false);
    await docTicket?.atomicUpdate((o) => {
      o.tipoDePago = 'pendiente';
      return o;
    });
    setFieldValue('tipoDePago', 'pendiente', false);
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
                onChange={async (_e, value) => {
                  const cliente = value !== null ? value : '';
                  setFieldValue('cliente', cliente, false);
                  await docTicket?.atomicUpdate((oldData) => {
                    oldData.cliente = cliente;
                    return oldData;
                  });
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
                // @ts-expect-error:autocomplete
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
