/* eslint-disable promise/catch-or-return */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable func-names */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-alert */
/* eslint-disable react/no-multi-comp */
// git commit -m "arreglo de detalles " --no-verify

import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { Provider as StoreProvider } from 'react-redux';
import { ErrorBoundary } from 'react-error-boundary';
import { configure } from 'react-hotkeys';
import client from './utils/client';

import { PLAZA, USUARIO } from './utils/queries';

import { auth } from './firebase';
import { history } from './utils/history';
import Dashboard from './layouts/Dashboard';
import Auth from './layouts/Auth';
import Error from './layouts/Error';
import { store } from './store';
import { REPORTAR_ERROR } from './utils/mutations';
import { plaza, Usuario, UsuarioVariables } from './types/apollo';
import { GlobalStyles } from './components';

configure({
  ignoreTags: ['select', 'textarea'],
});

auth.onAuthStateChanged(async (user) => {
  if (user && client) {
    if (store.getState().plaza.online || !store.getState().plaza._idPunto) {
      if (store.getState().plaza._idPunto) {
        await client.query<plaza>({
          query: PLAZA,
          variables: { _id: store.getState().plaza._idPunto },
        });
      }
      await client
        .query<Usuario, UsuarioVariables>({
          query: USUARIO,
          variables: { uid: user.uid },
        })
        .then((data) => {
          const { usuario } = data.data;
          if (usuario) {
            store.dispatch({
              type: 'SESSION_LOGIN',
              loginArgs: {
                nombre: usuario.nombre,
                // @ts-expect-error:roles
                roles: usuario.roles,
                uid: user.uid,
              },
            });
            if (usuario._idPunto && usuario.idInventario) {
              store.dispatch({
                type: 'ASIGNAR_PUNTO',
                asignarPuntoArgs: {
                  idInventario: usuario.idInventario,
                  _idPunto: usuario._idPunto,
                  _idPuntoPrincipal: usuario._idPuntoPrincipal,
                  infoPunto: usuario.infoPunto,
                  sinAlmacen: usuario.sinAlmacen,
                },
              });
            } else {
              store.dispatch({ type: 'DESACTIVAR_PUNTO' });
              alert('No hay ninguna plaza activa');
            }
          }
        });
    }
  } else {
    store.dispatch({ type: 'SESSION_LOGOUT' });
    history.push('/ingreso');
    if (client) {
      client.resetStore();
    }
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
        <GlobalStyles />
        <Router history={history}>
          <ErrorBoundary
            FallbackComponent={React.lazy(() => import('./views/Error405'))}
            onError={async (error) => {
              await client.mutate({
                mutation: REPORTAR_ERROR,
                variables: {
                  operation: `${JSON.stringify(error.message)} ${
                    history.location.pathname
                  }`,
                },
              });
              history.push('/error/405');
              window.location.reload();
            }}
          >
            <Switch>
              <RouteWrapper
                component={React.lazy(() => import('./views/Principal'))}
                exact
                layout={Dashboard}
                path="/"
              />
              <RouteWrapper
                component={React.lazy(() => import('./views/Articulos'))}
                exact
                layout={Dashboard}
                path="/articulos"
              />
              <RouteWrapper
                component={React.lazy(() => import('./views/Impresoras'))}
                exact
                layout={Dashboard}
                path="/impresoras"
              />
              <RouteWrapper
                component={React.lazy(() =>
                  import('./views/NuevoRegistroInventario')
                )}
                exact
                layout={Dashboard}
                path="/registroinventario"
              />
              <RouteWrapper
                component={React.lazy(() =>
                  import('./views/CalendarioRegistrosInventario')
                )}
                exact
                layout={Dashboard}
                path="/calendario"
              />
              <RouteWrapper
                component={React.lazy(() => import('./views/Ingreso'))}
                exact
                layout={Auth}
                path="/ingreso"
              />
              <RouteWrapper
                component={React.lazy(() => import('./views/Error405'))}
                layout={Error}
                path="/error/405"
              />
              <RouteWrapper
                component={React.lazy(() => import('./views/Error401'))}
                layout={Error}
                path="/error/401"
              />
              <RouteWrapper
                component={React.lazy(() => import('./views/DetallesPlaza'))}
                exact
                layout={Dashboard}
                path="/plazas/ver/:puntoId"
              />
              <RouteWrapper
                component={React.lazy(() =>
                  import('./views/DetallesPagoPunto')
                )}
                exact
                layout={Dashboard}
                path="/plazas/pagos/:puntoId/:id"
              />
              <RouteWrapper
                component={React.lazy(() =>
                  import('./views/DetallesIntercambioPunto')
                )}
                exact
                layout={Dashboard}
                path="/plazas/intercambios/:puntoId/:id"
              />
              <RouteWrapper
                component={React.lazy(() =>
                  import('./views/DetallesVentaPunto')
                )}
                exact
                layout={Dashboard}
                path="/plazas/ventas/:puntoId/:id"
              />
              <RouteWrapper
                component={React.lazy(() => import('./views/Error404'))}
                layout={Error}
                path="*"
              />
            </Switch>
          </ErrorBoundary>
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
