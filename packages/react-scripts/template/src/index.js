import React from 'react';
import ReactDOM from 'react-dom';

// Redux
import { Provider } from 'react-redux';

// Ours
import App from './containers/App';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
,
  document.getElementById('root')
);
