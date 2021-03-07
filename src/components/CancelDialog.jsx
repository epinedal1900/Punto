import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

const CancelDialog = (props) => {
  const {
    handleCancel,
    handleClose,
    open,
    loading,
    selectedId,
    message,
  } = props;
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogContent>
        <Typography>{message}</Typography>
        {loading && <LinearProgress />}
      </DialogContent>
      <DialogActions>
        <Button
          color="default"
          disabled={loading}
          onClick={handleClose}
          size="small"
        >
          Volver
        </Button>
        <Button
          autoFocus
          color="primary"
          disabled={loading}
          onClick={() => handleCancel(selectedId)}
          size="small"
          variant="outlined"
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelDialog;
