import React from 'react';
import ReactDOM from 'react-dom';

// Redux
import { Provider } from 'react-redux';

// Apollo
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';

// Ours
import App from './containers/App';
import store from './store';

// Mock data
import { stats, sales } from './mock-data';

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: ApolloLink.from([
    // new HttpLink({ uri: '/' }),
    withClientState({
      cache,
      defaults: {
        allStats: stats,
        allSales: sales
      }
    })
  ]),
  cache
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <App />
    </Provider>
  </ApolloProvider>,
  document.getElementById('root')
);
