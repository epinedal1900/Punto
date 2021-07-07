import { ApolloClient, InMemoryCache, from } from '@apollo/client';
import { errorLink, retryLink, authLink, httpLink } from './apolloClient';

const client = new ApolloClient({
  link: from([errorLink, authLink, retryLink, httpLink]),
  cache: new InMemoryCache({
    addTypename: false,
  }),
  // defaultOptions: {
  //   watchQuery: {
  //     fetchPolicy: 'no-cache',
  //   },
  //   query: {
  //     fetchPolicy: 'no-cache',
  //   },
  //   mutate: {
  //     fetchPolicy: 'no-cache',
  //   },
  // },
});

export default client;
