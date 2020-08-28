import React, { useState } from 'react';
// Material-UI
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme } from '@material-ui/core/styles';
// our App
import App from './App';

const main = (props) => {
  
  const [nightMode, setNightMode] = useState(false);

  const createTheme = () => {

    return createMuiTheme({
      palette: {
        type: nightMode ? 'dark' : 'light'
      },
      typography: {
        useNextVariants: true
      }
    });
  }

  const updateTheme = mode => {
    setNightMode(mode);
  };

    return (
      <MuiThemeProvider theme={createTheme()}>
        <CssBaseline />
        <App {...props} updateTheme={updateTheme} nightMode={nightMode} />
      </MuiThemeProvider>
    );
}

export default main;
