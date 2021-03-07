import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
}));

export default function SearchInput() {
  const classes = useStyles();

  return (
    <Paper className={classes.root} component="form">
      <InputBase
        className={classes.input}
        inputProps={{ 'aria-label': 'search google maps' }}
        placeholder="Buscar artículos"
      />
      <IconButton
        aria-label="search"
        className={classes.iconButton}
        type="submit"
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
