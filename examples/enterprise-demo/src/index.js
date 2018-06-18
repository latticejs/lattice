import React from 'react';
import ReactDOM from 'react-dom';

// Apollo
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import { ApolloLink } from 'apollo-link';
// apollo-link-http is included for your convinience but not used
// Uncomment this line and define your graphQL uri below on the apollo client definition
// import { HttpLink } from 'apollo-link-http';

// Ours
import App from './containers/App';
import resolvers from './resolvers';

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: ApolloLink.from([
    // new HttpLink({ uri: '/' }),
    withClientState({
      cache,
      ...resolvers
    })
  ]),
  cache
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
