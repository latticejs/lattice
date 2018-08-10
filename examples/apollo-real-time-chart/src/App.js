import React, { Component } from 'react';

// Material-UI
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme } from '@material-ui/core/styles';

import 'typeface-roboto';

// our App
import Dashboard from './Dashboard';
import Layout from './components/Layout';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nightMode: false
    };
  }

  createTheme() {
    const { nightMode } = this.state;

    return createMuiTheme({
      palette: {
        type: nightMode ? 'dark' : 'light'
      }
    });
  }

  updateTheme = mode => {
    this.setState({
      nightMode: mode
    });
  };

  render() {
    return (
      <MuiThemeProvider theme={this.createTheme()}>
        <Layout nightMode={this.state.nightMode} handleUpdateTheme={this.updateTheme}>
          <CssBaseline />
          <Dashboard {...this.props} />
        </Layout>
      </MuiThemeProvider>
    );
  }
}
