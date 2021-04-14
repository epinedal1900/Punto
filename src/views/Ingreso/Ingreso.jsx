import React from 'react';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import LoginForm from './components/LoginForm';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(6, 2),
  },
  card: {
    width: 366,
    maxWidth: '100%',
    overflow: 'unset',
    display: 'flex',
    position: 'relative',
    '& > *': {
      flexGrow: 1,
      flexBasis: '50%',
      width: '50%',
    },
  },
  content: {
    padding: theme.spacing(3, 2, 3, 2),
  },
}));

const Ingreso = () => {
  const classes = useStyles();

  return (
    <>
      <Box display="flex" justifyContent="center" m={0} mt={12}>
        <Card className={classes.card}>
          <CardContent className={classes.content}>
            <Typography gutterBottom variant="h5">
              Ingreso
            </Typography>
            <Box mt={3}>
              <LoginForm />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default Ingreso;
