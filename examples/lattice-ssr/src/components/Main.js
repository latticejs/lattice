import React, { Component } from 'react';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme } from '@material-ui/core/styles';
import App from './App';
import GaugeComp from './GaugeComp';

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
        <CssBaseline />
        <App {...this.props} updateTheme={this.updateTheme} nightMode={this.state.nightMode} />
        <GaugeComp {...this.props} nightMode={this.state.nightMode} />
      </MuiThemeProvider>
    );
  }
}