import merge from 'lodash.merge';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import { withClientState } from 'apollo-link-state';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';

// stores
import stores from '../stores';

import { authLink, onQLAuthError, onNetworkAuthError } from './auth';

const cache = new InMemoryCache();

// set up cache persistence.
persistCache({
  cache,
  storage: window.localStorage
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      onQLAuthError(client, message);
    });
  }

  if (networkError) {
    onNetworkAuthError(client, networkError);
  }
});

const client = new ApolloClient({
  link: ApolloLink.from([
    authLink,
    errorLink,
    withClientState({
      ...merge(...stores),
      cache
    }),
    new HttpLink({ uri: 'http://localhost:3001' })
  ]),
  cache
});

export default client;
