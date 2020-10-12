import 'react-toastify/dist/ReactToastify.css';
import { Auth0Provider } from './react-auth0-spa';
import { createBrowserHistory } from 'history';
import Main from './Main';
import React from 'react';
import ReactDOM from 'react-dom';
import config from './auth_config.json';

const history = createBrowserHistory();

const onRedirectCallback = (appState) => {
  history.push(appState && appState.targetUrl ? appState.targetUrl : window.location.pathname);
};

ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    client_id={config.clientId}
    redirect_uri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
  >
    <Main />
  </Auth0Provider>,
  document.getElementById('root')
);
