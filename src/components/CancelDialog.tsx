import React, { useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

interface CancelDialogProps {
  handleCancel: (a?: number) => void;
  handleClose: () => void;
  open: boolean;
  loading?: boolean;
  selectedId?: number;
  message: string;
  hacerEsperar?: boolean;
}
const CancelDialog = (props: CancelDialogProps): JSX.Element => {
  const {
    handleCancel,
    handleClose,
    open,
    loading,
    selectedId,
    message,
    hacerEsperar,
  } = props;
  const [espera, setEspera] = useState(true);
  useEffect(() => {
    const bloquearSubmit = async () => {
      setEspera(true);
      await new Promise((resolve) => setTimeout(resolve, 10000));
      setEspera(false);
    };
    if (hacerEsperar) {
      bloquearSubmit();
    } else {
      setEspera(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  return (
    <Dialog onClose={loading ? undefined : handleClose} open={open}>
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
          disabled={loading || espera}
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
