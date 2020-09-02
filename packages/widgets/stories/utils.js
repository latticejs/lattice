import React from 'react';
import { JssProvider } from 'react-jss';
import { createGenerateClassName } from '@material-ui/core/styles';

export const JssDecorator = (story) => (
  <JssProvider
    generateClassName={createGenerateClassName({
      dangerouslyUseGlobalCSS: true,
      productionPrefix: 'c',
    })}
  >
    {story()}
  </JssProvider>
);

export default () => {};
