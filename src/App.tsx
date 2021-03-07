/* eslint-disable react/no-multi-comp */
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// import { Grid } from '@material-ui/core';
import DayJsUtils from '@date-io/dayjs';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { history } from './utils/history';
import GlobalStyles from './components/GlobalStyles';
import theme from './theme';
import Principal from './views/Principal';
import Dashboard from './Dashboard';

export default function App() {
  return (
    // <ThemeProvider theme={theme}>
    //   <CssBaseline />
    //   <GlobalStyles />
    //   <MuiPickersUtilsProvider locale="esES" utils={DayJsUtils}>
    <Router history={history}>
      <Switch>
        <Dashboard>
          <Route component={Principal} path="/" />
        </Dashboard>
      </Switch>
    </Router>
    //   </MuiPickersUtilsProvider>
    // </ThemeProvider>
  );
}
// <Router>
//   <Switch>
//     <Route path="/" component={Main} />
//   </Switch>
// </Router>
