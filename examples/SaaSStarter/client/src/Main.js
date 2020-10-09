import React, { Component } from 'react';
// Material-UI
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
// our App
import App from './App';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nightMode: false,
    };
  }

  updateTheme = (mode) => {
    this.setState({
      nightMode: mode,
    });
  };

  createTheme() {
    const { nightMode } = this.state;
    return createMuiTheme({
      palette: {
        type: nightMode ? 'dark' : 'light',
      },
      typography: {
        useNextVariants: true,
      },
    });
  }

  render() {
    return (
      <ThemeProvider theme={this.createTheme()}>
        <CssBaseline />
        <App
          {...this.props}
          updateTheme={this.updateTheme}
          nightMode={this.state.nightMode}
        />
      </ThemeProvider>
    );
  }
}
