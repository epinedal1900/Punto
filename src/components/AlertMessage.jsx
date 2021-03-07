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

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: 800,
    width: '100%',
  },
}));

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
    <div className={classes.root}>
      <Snackbar
        anchorOrigin={anchorOrigin}
        autoHideDuration={4000}
        onClose={handleClose}
        onExit={handleExit}
        open={open}
      >
        <Alert
          action={
            <>
              {viewPath && (
                <Button
                  color="inherit"
                  component={RouterLink}
                  size="small"
                  to={viewPath}
                >
                  VER
                </Button>
              )}
              <IconButton
                aria-label="close"
                color="inherit"
                onClick={handleClose}
                size="small"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          }
          onClose={handleClose}
          severity={severity}
        >
          <h3>{message}</h3>
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AlertMessage;
