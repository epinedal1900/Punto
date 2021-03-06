import React, { Suspense } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { LinearProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  content: {
    height: '100%',
    paddingTop: 56,
    [theme.breakpoints.up('sm')]: {
      paddingTop: 64,
    },
  },
}));

const Auth = (props: {
  children: JSX.Element | JSX.Element[];
}): JSX.Element => {
  const { children } = props;

  const classes = useStyles();

  return (
    <main className={classes.content}>
      <Suspense fallback={<LinearProgress />}>{children}</Suspense>
    </main>
  );
};

export default Auth;
