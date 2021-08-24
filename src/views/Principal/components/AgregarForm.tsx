/* eslint-disable react/jsx-no-duplicate-props */
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { GlobalHotKeys } from 'react-hotkeys';
import Box from '@material-ui/core/Box';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import { RxDocument } from 'rxdb';
import TextField from '@material-ui/core/TextField';
import { useFormikContext } from 'formik';

import Tooltip from '@material-ui/core/Tooltip';
import { PrendaSuelta, PrincipalValues, SetState } from '../../../types/types';
import { IntegerFormat } from '../../../utils/TextFieldFormats';
import { Productos_productos_productos } from '../../../types/apollo';
import { TicketDb } from '../../../Database';
import { handleAgregarPrecio } from '../../../formPartials/ArticulosEscaner/ArticulosEscaner';

export interface AgregarFormProps {
  productos: Productos_productos_productos[];
  handleAgregarClose: () => void;
  agregarOpen: boolean;
  setAgregarOpen: SetState<boolean>;
  docTicket: RxDocument<TicketDb> | null;
  setDialogOpen: SetState<boolean>;
}
const AgregarForm = (props: AgregarFormProps): JSX.Element => {
  const {
    agregarOpen: open,
    handleAgregarClose,
    setAgregarOpen,
    productos,
    setDialogOpen,
    docTicket,
  } = props;
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
  } = useFormikContext<PrincipalValues>();

  const handleClose = () => {
    setAgregarOpen(false);
    setDialogOpen(false);
  };

  const handleAgregar = async () => {
    setFieldTouched('articulo', true, false);
    if (
      values.prendasSueltas.length < 20 &&
      open === true &&
      values.articulo !== '' &&
      docTicket
    ) {
      setAgregarOpen(false);
      setDialogOpen(false);
      const nuevasPrendasSueltas: PrendaSuelta[] = JSON.parse(
        JSON.stringify(values.prendasSueltas)
      );
      nuevasPrendasSueltas.push({
        articulo: values.articulo,
        cantidad: values.cantidad,
      });
      setFieldValue('prendasSueltas', nuevasPrendasSueltas, false);
      await docTicket.atomicUpdate((o) => {
        o.prendasSueltas = nuevasPrendasSueltas;
        return o;
      });
      handleAgregarPrecio(
        values.articulo.nombre,
        values.articulo._id,
        values.articulo.precio,
        values,
        setFieldValue,
        docTicket
      );

      setFieldValue('articulo', '', false);
      setFieldValue('cantidad', 0, false);
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
      <Dialog onClose={handleAgregarClose} open={open}>
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
                      if (values.esMenudeo) {
                        precio += 15;
                      }
                      setFieldValue('precio', precio, false);
                    }
                  }}
                  options={productos}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={
                        values.articulo === '' && Boolean(touched.articulo)
                      }
                      helperText={
                        values.articulo === '' && touched.articulo
                          ? 'requerido'
                          : ''
                      }
                      label="Artículo"
                      margin="dense"
                      name="articulo"
                      size="small"
                      variant="outlined"
                    />
                  )}
                  // @ts-expect-error:autocomplete
                  value={values.articulo}
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
              <span>
                <Button
                  color="primary"
                  disabled={values.prendasSueltas.length > 15}
                  onClick={handleAgregar}
                  size="small"
                  variant="outlined"
                >
                  Agregar
                </Button>
              </span>
            </Tooltip>
          </DialogActions>
        </Box>
      </Dialog>
    </GlobalHotKeys>
  );
};

export default AgregarForm;
