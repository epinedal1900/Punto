import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    padding: 3,
    paddingTop: '14vh',
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
  },
  imageContainer: {
    marginTop: 6,
    display: 'flex',
    justifyContent: 'center',
  },
  image: {
    maxWidth: '100%',
    width: 560,
    maxHeight: 300,
    height: 'auto',
  },
  buttonContainer: {
    marginTop: 6,
    display: 'flex',
    justifyContent: 'center',
  },
}));

const Error404 = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography align="center" variant="h3">
        404: Página no encontrada
      </Typography>
      <div className={classes.buttonContainer}>
        <Button
          color="primary"
          component={RouterLink}
          to="/"
          variant="outlined"
        >
          Ir a la página principal
        </Button>
      </div>
    </div>
  );
};

export default Error404;
