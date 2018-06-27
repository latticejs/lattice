import merge from 'lodash.merge';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import stores from '../stores';

const cache = new InMemoryCache();

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      'x-token': `${localStorage.getItem('token')}`
    }
  }));

  return forward(operation);
});

export default new ApolloClient({
  link: ApolloLink.from([
    authLink,
    new HttpLink({ uri: 'http://localhost:5000/graphql' }),
    withClientState({
      ...merge(...stores),
      cache
    })
  ]),
  cache
});
