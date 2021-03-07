/* eslint-disable no-unused-vars */
import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { AppBar, IconButton, Toolbar, Hidden, Button } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import InputIcon from '@material-ui/icons/Input';
// import useRouter from '../../../../utils/useRouter';

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: 'none',
  },
  flexGrow: {
    flexGrow: 1,
  },
  logoutButton: {
    marginLeft: theme.spacing(1),
  },
  logoutIcon: {
    marginRight: theme.spacing(1),
  },
}));

const TopBar = () => {
  const classes = useStyles();

  return (
    <AppBar className={classes.root} color="primary">
      <Toolbar>
        <Hidden lgUp>
          <IconButton
            color="inherit"
            flexgrow={1}
            // eslint-disable-next-line no-console
            onClick={() => console.log('hi')}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
        <div className={classes.flexGrow} />
        <Button
          className={classes.logoutButton}
          color="inherit"
          // eslint-disable-next-line no-console
          onClick={() => console.log('hi')}
        >
          <InputIcon className={classes.logoutIcon} />
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
