import React, { Component } from 'react';
// Material-UI
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { createMuiTheme } from '@material-ui/core/styles';
// our App
import App from './App';

export default class Main extends Component {
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
        <App {...this.props} updateTheme={this.updateTheme} nightMode={this.state.nightMode} />
      </MuiThemeProvider>
    );
  }
}
