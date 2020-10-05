import merge from 'lodash.merge';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';

// stores
import stores from '../stores';

import { authLink, onQLAuthError, onNetworkAuthError } from './auth';

const cache = new InMemoryCache();

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

const stateLink = withClientState({
  ...merge(...stores),
  cache,
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, errorLink, stateLink, new HttpLink({ uri: 'http://localhost:3001' })]),
  cache,
  resolvers: {
    Mutation: {
      updateNetworkStatus: (_, { isConnected }, { cache }) => {
        const data = {
          networkStatus: {
            __typename: 'NetworkStatus',
            isConnected,
          },
        };
        cache.writeData({ data });
        return null;
      },
    },
  },
});

client.onResetStore(stateLink.writeDefaults);

export default client;
