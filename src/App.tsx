/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable func-names */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-alert */
/* eslint-disable no-underscore-dangle */
/* eslint-disable promise/always-return */
/* eslint-disable react/no-multi-comp */
import React from 'react';
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

import { USUARIO, PUNTO_ID_ACTIVO } from './utils/queries';

import { auth } from './firebase';
import { errorLink, retryLink, authLink, httpLink } from './utils/apolloClient';
import { history } from './utils/history';
import Principal from './views/Principal';
import Movimientos from './views/Movimientos';
import DetallesMovimiento from './views/DetallesMovimiento';
import RegistroInventario from './views/RegistroInventario';
import Articulos from './views/Articulos';
import Error405 from './views/Error405';
import Gastos from './views/Gastos';
import Error404 from './views/Error404';
import Error401 from './views/Error401';
import Ingreso from './views/Ingreso';
import Impresoras from './views/Impresoras';
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
    // if (store.getState().session.loggedIn === 'false') {
    // await client.query({ query: INITIAL_LOAD });
    let _id;
    let nombre;
    let roles;
    let infoPunto;
    await client
      .query({ query: USUARIO, variables: { uid: user.uid } })
      .then((data, error) => {
        if (!error && !(data.data.usuario == null)) {
          roles = data.data.usuario.roles;
          nombre = data.data.usuario.nombre;
          _id = data.data.usuario._id;
          infoPunto = data.data.usuario.infoPunto;
        }
      });
    await client
      .query({ query: PUNTO_ID_ACTIVO, variables: { nombre } })
      .then(async (data, error) => {
        if (!error && !(data.data.puntoIdActivo == null)) {
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('roles', JSON.stringify(roles));
          localStorage.setItem('nombre', nombre);
          localStorage.setItem('puntoIdActivo', data.data.puntoIdActivo);
          localStorage.setItem('infoPunto', infoPunto);
          await store.dispatch(
            login({
              uid: _id,
              nombre,
              roles: JSON.stringify(roles),
              puntoIdActivo: data.data.puntoIdActivo,
              infoPunto,
            })
          );
          history.push('/');
        } else {
          alert('No hay ninguna plaza activa');
        }
      })
      .catch((err) => {
        alert(JSON.stringify(err));
      });
    // }
  } else {
    store.dispatch(logout());
    localStorage.setItem('loggedIn', 'false');
    localStorage.removeItem('nombre');
    localStorage.removeItem('roles');
    localStorage.removeItem('puntoIdActivo');
    localStorage.removeItem('infoPunto');
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
              component={Movimientos}
              exact
              layout={Dashboard}
              path="/movimientos"
            />
            <RouteWrapper
              component={DetallesMovimiento}
              exact
              layout={Dashboard}
              path="/movimientos/:id"
            />
            <RouteWrapper
              component={Gastos}
              exact
              layout={Dashboard}
              path="/gastos"
            />
            <RouteWrapper
              component={Articulos}
              exact
              layout={Dashboard}
              path="/articulos"
            />
            <RouteWrapper
              component={Impresoras}
              exact
              layout={Dashboard}
              path="/impresoras"
            />
            <RouteWrapper
              component={RegistroInventario}
              exact
              layout={Dashboard}
              path="/registroinventario"
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
              component={Error401}
              layout={Error}
              path="/error/401"
            />
            <RouteWrapper component={Error404} layout={Error} path="*" />
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
