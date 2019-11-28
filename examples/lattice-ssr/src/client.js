import React from 'react';
import { hydrate } from 'react-dom';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName } from '@material-ui/core/styles';
import Main from './Components/Main';

const generateClassName = createGenerateClassName();

hydrate(
  <JssProvider generateClassName={generateClassName}>
    <Main />
  </JssProvider>,
  document.getElementById('root'),
  () => {
    document.getElementById('jss-styles').parentNode.removeChild(document.getElementById('jss-styles'));
  }
);
