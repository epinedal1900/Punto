import React, { ReactNode } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import LinearProgress from '@material-ui/core/LinearProgress';
import { DialogTitle } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { SetState } from '../types/types';

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    padding: theme.spacing(2),
  },
}));

type FormDialogProps<T> = {
  title?: string;
  open: boolean;
  setOpen: SetState<boolean>;
  handleSubmit: (values: T, action: FormikHelpers<T>) => void;
  validationSchema: any;
  submitText?: string;
  initialValues: T;
  render: (props: FormikProps<T>) => ReactNode;
  loading?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  handleClose?: () => void;
  disableSubmit?: (props: FormikProps<T>) => boolean;
};
const FormDialog = <T extends Record<string, any>>(
  props: FormDialogProps<T>
): JSX.Element => {
  const classes = useStyles();

  const {
    open,
    setOpen,
    handleSubmit,
    loading,
    validationSchema,
    submitText = 'Añadir',
    initialValues,
    render,
    maxWidth,
    disableSubmit,
    handleClose,
    title,
  } = props;

  const onClose = () => {
    if (handleClose) handleClose();
    setOpen(false);
  };
  return (
    <Formik<T>
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validateOnBlur={false}
      validateOnChange={false}
      validationSchema={validationSchema}
    >
      {(formikProps) => (
        <Dialog
          fullWidth
          maxWidth={maxWidth}
          onClose={formikProps.isSubmitting ? undefined : onClose}
          open={open}
        >
          <form onSubmit={formikProps.handleSubmit}>
            {title && <DialogTitle>{title}</DialogTitle>}
            <DialogContent className={classes.dialogContent}>
              {render(formikProps)}
              {(loading || formikProps.isSubmitting) && <LinearProgress />}
            </DialogContent>
            <DialogActions>
              <Button
                color="default"
                disabled={formikProps.isSubmitting}
                onClick={onClose}
                size="small"
              >
                Cancelar
              </Button>
              <Button
                autoFocus
                color="primary"
                disabled={
                  formikProps.isSubmitting ||
                  !formikProps.dirty ||
                  (disableSubmit && disableSubmit(formikProps))
                }
                id="submit"
                size="small"
                type="submit"
                variant="outlined"
              >
                {submitText}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      )}
    </Formik>
  );
};

export default FormDialog;
