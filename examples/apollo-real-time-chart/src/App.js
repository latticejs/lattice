import React, { useState } from 'react';

// Material-UI
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme } from '@material-ui/core/styles';

import 'typeface-roboto';

// our App
import Dashboard from './Dashboard';
import Layout from './components/Layout';

const App = () => {
  const [nightMode, setNightMode] = useState(false);

  const createTheme = () => {
    return createMuiTheme({
      palette: {
        type: nightMode ? 'dark' : 'light',
      },
      typography: {
        useNextVariants: true,
      },
    });
  };

  const updateTheme = (mode) => {
    setNightMode(mode);
  };

  return (
    <MuiThemeProvider theme={createTheme()}>
      <Layout nightMode={nightMode} handleUpdateTheme={updateTheme}>
        <CssBaseline />
        <Dashboard {...this.props} />
      </Layout>
    </MuiThemeProvider>
  );
};

export default App;
