import { colors } from '@material-ui/core';

require('dotenv').config();

const white = '#FFFFFF';
const black = '#000000';

const dev = process.env.NODE_ENV === 'development';

export default {
  black,
  white,
  primary: {
    contrastText: white,
    dark: dev ? black : colors.indigo[900],
    main: dev ? black : colors.indigo[500],
    light: dev ? black : colors.indigo[100],
  },
  secondary: {
    contrastText: white,
    dark: dev ? black : colors.blue[900],
    main: dev ? black : colors.blue.A400,
    light: dev ? black : colors.blue.A100,
  },
  error: {
    contrastText: white,
    dark: colors.red[900],
    main: colors.red[600],
    light: colors.red[400],
  },
  text: {
    primary: colors.blueGrey[900],
    secondary: colors.blueGrey[600],
    link: colors.blue[600],
  },
  link: colors.blue[800],
  icon: colors.blueGrey[600],
  background: {
    default: '#F4F6F8',
    paper: white,
  },
  divider: colors.grey[200],
};
