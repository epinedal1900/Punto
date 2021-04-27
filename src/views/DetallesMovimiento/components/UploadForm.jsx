import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { Formik } from 'formik';
import * as yup from 'yup';
import LinearProgress from '@material-ui/core/LinearProgress';
import { FilesDropzone } from 'components';

const validationSchema = yup.object({
  files: yup.array().min(1),
});

const UploadForm = (props) => {
  const { open, handleUploadClose, handleSubmit, loading } = props;

  return (
    <Dialog onClose={handleUploadClose} open={open}>
      <Formik
        initialValues={{ files: [] }}
        onSubmit={handleSubmit}
        validateOnBlur={false}
        validateOnChange={false}
        validationSchema={validationSchema}
      >
        {(formikProps) => (
          <form onSubmit={formikProps.handleSubmit}>
            <DialogContent>
              <FilesDropzone maxFiles={1} title="Comprobante" value="files" />
              {(loading || formikProps.isSubmitting) && <LinearProgress />}
            </DialogContent>
            <DialogActions>
              <Button
                color="default"
                disabled={formikProps.isSubmitting || loading}
                onClick={handleUploadClose}
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
                Subir
              </Button>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default UploadForm;
