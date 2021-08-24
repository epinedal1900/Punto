/* eslint-disable no-alert */
/* eslint-disable consistent-return */
/* eslint-disable promise/always-return */
import { HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { setContext } from '@apollo/client/link/context';
import { history } from './history';
import { auth } from '../firebase';
import { store } from '../store';
import client from './client';
import { REPORTAR_ERROR } from './mutations';

require('dotenv').config();

export const errorLink = onError(
  // @ts-expect-error: error
  async ({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors) {
      alert(JSON.stringify(graphQLErrors, null, 2));
      client.mutate({
        mutation: REPORTAR_ERROR,
        variables: {
          operation: `${JSON.stringify(
            operation.operationName
          )} ${JSON.stringify(operation.variables)} ${
            graphQLErrors[0].message
          }`,
        },
      });
      graphQLErrors.map(({ message }) => {
        if (message === 'UNAUTHENTICATED') {
          alert(JSON.stringify(message));
          // auth.signOut();
          return 0;
        }

        history.push('/error/405');
        return 0;
      });
      return 0;
    }
    if (networkError) {
      alert('Modo sin conexión activado');
      store.dispatch({ type: 'MODIFICAR_ONLINE', modificarOnline: false });
    }
  }
);

export const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true,
  },
  attempts: {
    max: 5,
    retryIf: (error) => !!error,
  },
});
let uri;
if (process.env.NODE_ENV === 'development') {
  uri = 'http://192.168.100.149:4000/graphql'; // dev Main
} else {
  uri = 'https://server-dot-dark-garden-296622.ue.r.appspot.com/8081/graphql'; // Main
}

export const httpLink = new HttpLink({
  uri,
});

export const authLink = setContext(async (_, { headers }) => {
  const token: any = [];
  await auth.onAuthStateChanged(async (user) => {
    if (user) {
      await user.getIdToken().then((res) => {
        token.push(res);
      });
    }
  });
  return {
    headers: {
      ...headers,
      authorization: token,
    },
  };
});
