import React, { Suspense } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { LinearProgress } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
  },
}));

const Error = (props: {
  children: JSX.Element | JSX.Element[];
}): JSX.Element => {
  const { children } = props;

  const classes = useStyles();

  return (
    <main className={classes.root}>
      <Suspense fallback={<LinearProgress />}>{children}</Suspense>
    </main>
  );
};

export default Error;
