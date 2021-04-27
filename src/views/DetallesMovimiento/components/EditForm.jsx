import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { Formik } from 'formik';
import * as yup from 'yup';
import LinearProgress from '@material-ui/core/LinearProgress';

import Articulos from '../../../formPartials/Articulos';

const validationSchema = yup.object({
  articulos: yup
    .array()
    .of(
      yup.object().shape({
        articulo: yup.string().required('requerido'),
        cantidad: yup.number().required('requerido').min(1, 'requerido'),
        precio: yup.number().required('requerido').min(1, 'requerido'),
      })
    )
    .test(
      'selected',
      'Ingrese al menos 1 artículo',
      (values) => values.length > 0
    ),
});

const EditForm = (props) => {
  const {
    articulos,
    opcionesArticulos,
    open,
    handleEditClose,
    handleSubmit,
    loading,
  } = props;

  return (
    <Dialog onClose={handleEditClose} open={open}>
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
              <Articulos opcionesArticulos={opcionesArticulos} />
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
