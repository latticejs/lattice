import React, { Component } from 'react';

// Material-UI
import CssBaseline from 'material-ui/CssBaseline';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Typography from 'material-ui/Typography';
import { createMuiTheme } from 'material-ui/styles';

// Typeface
import 'typeface-roboto';

const muiTheme = {
  typography: {
    title: {
      fontWeight: 300
    }
  }
}

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={createMuiTheme(muiTheme)}>
        <CssBaseline>
          <Typography variant="display1" align="center">Welcome to Lattice</Typography>
          <Typography variant="subheading">Edit src/App.js</Typography>
        </CssBaseline>
      </MuiThemeProvider>
    );
  }
}

export default App;
