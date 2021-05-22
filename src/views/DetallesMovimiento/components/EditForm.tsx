import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { Formik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import LinearProgress from '@material-ui/core/LinearProgress';

import { ArticuloForm, ArticuloOption } from 'types/types';
import Articulos from '../../../formPartials/Articulos';

const validationSchema = yup.object({
  articulos: yup
    .array()
    .of(
      yup.object().shape({
        articulo: yup.object().required('requerido'),
        cantidad: yup.number().required('requerido').min(1, 'requerido'),
      })
    )
    .test(
      'selected',
      'Ingrese al menos 1 artículo',
      (values: any) => values.length > 0
    ),
});
interface EditFormProps {
  articulos: ArticuloForm[];
  opcionesArticulos: ArticuloOption[];
  open: boolean;
  handleEditClose: () => void;
  handleSubmit: (
    values: { articulos: ArticuloForm[] },
    actions?: FormikHelpers<{ articulos: ArticuloForm[] }>
  ) => void;
  loading: boolean;
}

const EditForm = (props: EditFormProps): JSX.Element => {
  const {
    articulos,
    opcionesArticulos,
    open,
    handleEditClose,
    handleSubmit,
    loading,
  } = props;

  return (
    <Dialog fullWidth onClose={handleEditClose} open={open}>
      <Formik
        initialValues={{ articulos }}
        onSubmit={handleSubmit}
        validateOnBlur={false}
        validateOnChange={false}
        validationSchema={validationSchema}
      >
        {(formikProps) => (
          <form onSubmit={formikProps.handleSubmit}>
            <DialogContent>
              <Articulos
                descripcion="Modifique para que coincida con los artículos recibidos"
                incluirPrecio={false}
                opcionesArticulos={opcionesArticulos}
              />
              {loading && <LinearProgress />}
            </DialogContent>
            <DialogActions>
              <Button
                color="default"
                disabled={formikProps.isSubmitting}
                onClick={handleEditClose}
                size="small"
              >
                Cancelar
              </Button>
              <Button
                autoFocus
                color="primary"
                disabled={formikProps.isSubmitting || !formikProps.dirty}
                size="small"
                type="submit"
                variant="outlined"
              >
                Editar
              </Button>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default EditForm;
