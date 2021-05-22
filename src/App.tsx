/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable func-names */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-alert */
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
import { Role } from './types/types';
import { Usuario } from './types/graphql';
import { logout, login } from './actions';

import { USUARIO, PUNTO_ID_ACTIVO, MOVIMIENTOS } from './utils/queries';

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
import store from './utils/store';

configure({
  ignoreTags: ['select', 'textarea'],
});

const client = new ApolloClient({
  link: from([errorLink, authLink, retryLink, httpLink]),
  cache: new InMemoryCache({
    addTypename: false,
  }),
});
// window.addEventListener('online', () => {
//   if (window.navigator.onLine) {
//     alert('Became online');
//   }
// });
// window.addEventListener('offline', () => {
//   if (!window.navigator.onLine) {
//     alert('Became offline');
//   }
// });
// if (!store.getState().session.online) {
//   alert('Modo sin conexión activado');
// }
// if (window.navigator.onLine) {
//   alert('Modo sin conexión activado');
// }
auth.onAuthStateChanged(async (user) => {
  if (user && client) {
    if (
      store.getState().session.online ||
      !store.getState().session.puntoIdActivo
    ) {
      if (store.getState().session.puntoIdActivo) {
        // alert(JSON.stringify(user));
        await client.query({
          query: MOVIMIENTOS,
          variables: { _id: store.getState().session.puntoIdActivo },
        });
      }
      let _id: string;
      let nombre = '';
      let roles: Role[];
      let infoPunto: string;
      let sinAlmacen: boolean;
      await client
        .query({
          query: USUARIO,
          variables: { uid: user.uid },
        })
        .then((data: { data: { usuario: Usuario } }) => {
          if (data.data.usuario) {
            roles = data.data.usuario.roles;
            nombre = data.data.usuario.nombre;
            _id = data.data.usuario._id;
            infoPunto = data.data.usuario.infoPunto || '';
            sinAlmacen = Boolean(data.data.usuario.sinAlmacen);
          }
        });
      await client
        .query({ query: PUNTO_ID_ACTIVO, variables: { nombre } })
        .then(async (data: { data: { puntoIdActivo: string } }) => {
          if (data.data.puntoIdActivo) {
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('roles', JSON.stringify(roles));
            localStorage.setItem('nombre', nombre);
            localStorage.setItem('infoPunto', infoPunto);
            localStorage.setItem('sinAlmacen', sinAlmacen ? 'true' : 'false');
            await store.dispatch(
              login({
                uid: _id,
                nombre,
                roles: JSON.stringify(roles),
                puntoIdActivo: data.data.puntoIdActivo,
                infoPunto,
                sinAlmacen,
              })
            );
            history.push('/');
            if (data.data.puntoIdActivo == null) {
              alert('No hay ninguna plaza activa');
            } else {
              localStorage.setItem('puntoIdActivo', data.data.puntoIdActivo);
            }
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
    localStorage.removeItem('puntoIdActivo');
    localStorage.removeItem('infoPunto');
    localStorage.removeItem('sinAlmacen');
    history.push('/ingreso');
    client.resetStore();
  }
});

function RouteWrapper({ component: Component, layout: Layout, ...rest }: any) {
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
