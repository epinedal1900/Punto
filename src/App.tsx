/* eslint-disable func-names */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-alert */
/* eslint-disable no-underscore-dangle */
/* eslint-disable promise/always-return */
/* eslint-disable react/no-multi-comp */
import React, { lazy } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  from,
} from '@apollo/client';

import { Provider as StoreProvider } from 'react-redux';

import { configure } from 'react-hotkeys';
import { logout, login } from './actions';

import { USUARIO } from './utils/queries';

import { auth } from './firebase';
import { errorLink, retryLink, authLink, httpLink } from './utils/apolloClient';
import { history } from './utils/history';
import Principal from './views/Principal';
import Ventas from './views/Ventas';
import Error405 from './views/Error405';
import Error404 from './views/Error404';
import Error401 from './views/Error401';
import Ingreso from './views/Ingreso';
import Dashboard from './layouts/Dashboard';
import Auth from './layouts/Auth';
import Error from './layouts/Error';
import { configureStore } from './store';

configure({
  ignoreTags: ['select', 'textarea'],
});

const store = configureStore();

const client = new ApolloClient({
  link: from([errorLink, authLink, retryLink, httpLink]),
  cache: new InMemoryCache({
    addTypename: false,
  }),
});

auth.onAuthStateChanged(async (user) => {
  if (user && client) {
    if (store.getState().session.loggedIn === 'false') {
      // await client.query({ query: INITIAL_LOAD });
      await client
        .query({ query: USUARIO, variables: { uid: user.uid } })
        .then(async (data, error) => {
          if (!error && !(data.data.usuario == null)) {
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem(
              'roles',
              JSON.stringify(data.data.usuario.roles)
            );
            localStorage.setItem('nombre', data.data.usuario.nombre);
            await store.dispatch(
              login({
                uid: data.data.usuario._id,
                nombre: data.data.usuario.nombre,
                roles: JSON.stringify(data.data.usuario.roles),
              })
            );
            history.push('/');
          }
        })
        .catch((err) => {
          alert(JSON.stringify(err));
        });
    }
  } else {
    store.dispatch(logout());
    localStorage.setItem('loggedIn', 'false');
    localStorage.removeItem('nombre');
    localStorage.removeItem('roles');
    history.push('/ingreso');
    client.resetStore();
  }
});

function RouteWrapper({ component: Component, layout: Layout, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => (
        <Layout {...props}>
          <Component {...props} />
        </Layout>
      )}
    />
  );
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <StoreProvider store={store}>
        <Router history={history}>
          <Switch>
            <RouteWrapper
              component={Principal}
              exact
              layout={Dashboard}
              path="/"
            />
            <RouteWrapper
              component={Ventas}
              exact
              layout={Dashboard}
              path="/ventas"
            />
            <RouteWrapper
              component={Ingreso}
              exact
              layout={Auth}
              path="/ingreso"
            />
            <RouteWrapper
              component={Error405}
              layout={Error}
              path="/error/405"
            />
            <RouteWrapper
              component={Error404}
              layout={Error}
              path="/error/404"
            />
            <RouteWrapper
              component={Error401}
              layout={Error}
              path="/error/401"
            />
            {/* <ProtectedRouteWrapper
              component={Principal}
              layout={Dashboard}
              path="/"
            /> */}
          </Switch>
        </Router>
      </StoreProvider>
    </ApolloProvider>
  );
}
// <Router>
//   <Switch>
//     <Route path="/" component={Main} />
//   </Switch>
// </Router>
