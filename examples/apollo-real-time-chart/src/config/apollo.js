import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloLink, split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';

const API_URL = process.env.REACT_API_URL || 'localhost:3001';

const cache = new InMemoryCache();

const httpLink = new HttpLink({ uri: `http://${API_URL}` });

const wsLink = new WebSocketLink({
  uri: `ws://${API_URL}`,
  options: {
    reconnect: true
  }
});

const terminatingLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    // we use wsLink only for subscription operations
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: ApolloLink.from([terminatingLink]),
  cache
});

export default client;
