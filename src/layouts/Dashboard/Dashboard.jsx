import React, { Suspense } from 'react';
import { makeStyles } from '@material-ui/styles';
import { LinearProgress } from '@material-ui/core';
import { renderRoutes } from 'react-router-config';
import { TopBar } from './components';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    margin: 'none',
  },
  topBar: {
    zIndex: 2,
    position: 'relative',
  },
  container: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
  },
  navBar: {
    zIndex: 3,
    width: 256,
    minWidth: 256,
    flex: '0 0 auto',
  },
  content: {
    overflowY: 'auto',
    flex: '1 1 auto',
  },
  rootBar: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  logoutButton: {
    marginLeft: theme.spacing(1)
  },
  logoutIcon: {
    marginRight: theme.spacing(1)
  }
}));

const Dashboard = (props) => {
  const { children } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TopBar
        className={classes.topBar}
        // onOpenNavBarMobile={handleNavBarMobileOpen}
      />
      <h2>hi</h2>
      <div className={classes.container}>
        <main className={classes.content}>
          <Suspense fallback={<LinearProgress />}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
