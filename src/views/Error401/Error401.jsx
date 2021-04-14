import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button, useTheme, useMediaQuery } from '@material-ui/core';
import { auth } from '../../firebase';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    paddingTop: '10vh',
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
  },
  imageContainer: {
    marginTop: theme.spacing(6),
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
    marginTop: theme.spacing(6),
    display: 'flex',
    justifyContent: 'center',
  },
}));

const Error401 = () => {
  const classes = useStyles();
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Typography align="center" variant={mobileDevice ? 'h4' : 'h1'}>
        401: Acceso denegado
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
      <div className={classes.buttonContainer}>
        <Button
          color="secondary"
          onClick={() => auth.signOut()}
          variant="outlined"
        >
          Cerrar sesión
        </Button>
      </div>
    </>
  );
};

export default Error401;
