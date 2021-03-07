import React from 'react';
import {
  Grid,
  AppBar,
  IconButton,
  Toolbar,
  Hidden,
  Button,
  Typography,
  Card,
  CardContent,
  Box,
  CardActions,
} from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import InputIcon from '@material-ui/icons/Input';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';

import { makeStyles } from '@material-ui/styles';
import Search from './components/Search';
import Tickets from './components/Tickets';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    margin: 'none',
  },
  flexGrow: {
    flexGrow: 1,
  },
  container: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
  },
  content: {
    overflowY: 'auto',
    flex: '1 1 auto',
  },
  cardContent: {
    padding: 0,
    height: 510,
  },
  cardActions: {
    padding: 0,
  },
  rootBar: {
    boxShadow: 'none',
  },
}));

const Principal = () => {
  const classes = useStyles();
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.search} elevation={2}>
            <Search />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Card className={classes.search} elevation={2}>
            <CardContent className={classes.cardContent}>
              <Tickets />
            </CardContent>
            <CardActions className={classes.cardActions}>
              <Box display="flex" m={0} p={1} width="100%">
                <Box p={1}>
                  <Button color="secondary" variant="outlined">
                    Eliminar
                  </Button>
                </Box>
                <Box flexGrow={1} p={1}>
                  <Button color="primary" variant="outlined">
                    Asignar Cliente
                  </Button>
                </Box>
                <Box p={1}>
                  <Button color="primary" variant="outlined">
                    Reimprimir último ticket
                  </Button>
                </Box>
                <Box p={1}>
                  <Button color="primary" variant="contained">
                    Cobrar
                  </Button>
                </Box>
                <Box alignSelf="center" p={1}>
                  <Typography variant="h5"> Total: $12,000.00</Typography>
                </Box>
              </Box>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Principal;
