import React from 'react';
import ReactDOM from 'react-dom';

// Apollo
import { ApolloProvider } from 'react-apollo';
import apolloClient from './config/apollo';

// Ours

import App from './containers/App';

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
