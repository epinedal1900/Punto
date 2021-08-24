/* eslint-disable react/no-multi-comp */
import React, { useState } from 'react';
import Snackbar, {
  SnackbarCloseReason,
  SnackbarOrigin,
} from '@material-ui/core/Snackbar';
import MuiAlert, { Color } from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

interface AlertProps {
  className: string;
  onClose: (
    event: React.SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => void;
  severity: Color;
  children: React.ReactNode;
}
const Alert = (props: AlertProps): JSX.Element => {
  const { severity, onClose, className, children } = props;
  return (
    <MuiAlert
      className={className}
      elevation={6}
      // @ts-expect-error:err
      onClose={onClose}
      severity={severity}
      variant="filled"
    >
      {children}
    </MuiAlert>
  );
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
  severity: Color;
  message: string;
  handleExit: () => void;
  anchorOrigin: SnackbarOrigin;
}
const AlertMessage = (props: AlertMessageProps): JSX.Element => {
  const { severity, message, handleExit, anchorOrigin } = props;
  const [open, setOpen] = useState(true);
  const classes = useStyles();

  const handleClose = (
    _e: React.SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => {
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
