import React, { Component } from 'react';
// Material-UI
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme } from '@material-ui/core/styles';
// our App
import App from './App';

const main = (props) => {
  
  const [nightMode, setNightMode] = useState(false);

  const createTheme = () => {
    // const { nightMode } = this.state;
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
        <App {...this.props} updateTheme={updateTheme} nightMode={nightMode} />
      </MuiThemeProvider>
    );
}

export default main;
