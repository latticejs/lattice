import React from 'react';
import { hydrate } from 'react-dom';
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
import Main from './Components/Main';

const generateClassName = createGenerateClassName();

hydrate(
  <StylesProvider generateClassName={generateClassName}>
    <Main />
  </StylesProvider>,
  document.getElementById('root'),
  () => {
    document.getElementById('jss-styles').parentNode.removeChild(document.getElementById('jss-styles'));
  }
);
