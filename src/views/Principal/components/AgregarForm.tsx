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
import { ArrayHelpers, useFormikContext } from 'formik';
import { useSelector } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import { RootState } from '../../../types/store';
import { ArticuloOption, Session, PrincipalValues } from '../../../types/types';
import { MoneyFormat, IntegerFormat } from '../../../utils/TextFieldFormats';

interface AgregarFormProps {
  open: boolean;
  handleAddClose: () => void;
  setAgregarOpen: (a: boolean) => void;
  opcionesArticulos: ArticuloOption[];
  arrayHelpers: ArrayHelpers;
  setDialogOpen: (a: boolean) => void;
  selectedTicket: number;
}
const AgregarForm = (props: AgregarFormProps): JSX.Element => {
  const {
    open,
    handleAddClose,
    setAgregarOpen,
    opcionesArticulos,
    arrayHelpers,
    setDialogOpen,
    selectedTicket,
  } = props;
  const { values, errors, touched, setFieldValue } = useFormikContext<
    PrincipalValues
  >();
  const session: Session = useSelector((state: RootState) => state.session);

  const handleClose = () => {
    setAgregarOpen(false);
    setDialogOpen(false);
  };

  const handleAgregar = () => {
    if (values.articulos.length < 20 && open === true) {
      arrayHelpers.insert(0, {
        articulo: values.articulo,
        cantidad: values.cantidad,
        precio: values.precio,
      });
      setFieldValue('articulo', '', false);
      setFieldValue('cantidad', 0, false);
      setFieldValue('precio', 0, false);
      setAgregarOpen(false);
      setDialogOpen(false);
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
                  error={Boolean(errors.cantidad) && touched.cantidad}
                  helperText={
                    errors.cantidad && touched.cantidad ? errors.cantidad : ''
                  }
                  id="cantidad"
                  InputProps={{ inputComponent: IntegerFormat }}
                  inputProps={{ maxLength: 7 }}
                  label="Cantidad"
                  margin="dense"
                  name="cantidad"
                  onChange={(e) => {
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
                  onChange={(_e, value) => {
                    setFieldValue(
                      'articulo',
                      value !== null ? value : '',
                      false
                    );
                    if (typeof value === 'object' && value !== null) {
                      let { precio } = value;
                      if (session.tickets[selectedTicket].esMenudeo) {
                        precio += 15;
                      }
                      setFieldValue('precio', precio, false);
                    }
                  }}
                  options={opcionesArticulos}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={
                        Boolean(errors.articulo) && Boolean(touched.articulo)
                      }
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
                  // @ts-expect-error: error
                  value={values.articulo}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  // defaultValue={value > 0 ? value : ''}
                  error={Boolean(errors.precio) && touched.precio}
                  helperText={
                    errors.precio && touched.precio ? errors.precio : ''
                  }
                  id="precio"
                  InputProps={{ inputComponent: MoneyFormat }}
                  inputProps={{ maxLength: 7 }}
                  label="Precio"
                  margin="dense"
                  name="precio"
                  onChange={(e) => {
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
