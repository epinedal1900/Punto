/* eslint-disable react/no-multi-comp */
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { Link as RouterLink } from 'react-router-dom';

const Alert = (props) => {
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

const AlertMessage = (props) => {
  const { severity, message, viewPath, handleExit, anchorOrigin } = props;
  const [open, setOpen] = useState(true);
  const classes = useStyles();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    // <div className={classes.root}>
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
    // </div>
  );
};

export default AlertMessage;
