/* eslint-disable react/no-multi-comp */
import React, { useState } from 'react';
import Snackbar, { SnackbarOrigin } from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

const Alert = (props: any): JSX.Element => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const useStyles = makeStyles({
  cookieAlert: {
    '& .MuiAlert-icon': {
      fontSize: 30,
    },
    '& .MuiAlert-message': {
      fontSize: 20,
    },
  },
});
interface AlertMessageProps {
  severity: 'success' | 'info' | 'warning' | 'error';
  message: string;
  handleExit: () => void;
  anchorOrigin: SnackbarOrigin;
}
const AlertMessage = (props: AlertMessageProps): JSX.Element => {
  const { severity, message, handleExit, anchorOrigin } = props;
  const [open, setOpen] = useState(true);
  const classes = useStyles();

  const handleClose = (_e: any, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={anchorOrigin}
      autoHideDuration={30000}
      onClose={handleClose}
      onExit={handleExit}
      open={open}
    >
      <Alert
        className={classes.cookieAlert}
        onClose={handleClose}
        severity={severity}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertMessage;
