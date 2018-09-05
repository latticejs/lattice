import React, { Component } from 'react';
// Material-UI
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme } from '@material-ui/core/styles';
// our App
import App from './App';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nightMode: false,
      pkg: {
        name: 'dummyApp',
        dependencies: {
          dep1: 'latest',
          dep2: '1.0.0'
        }
      }
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

  parsePackage = pkg => {
    return {
      name: pkg.name,
      data: {
        nodes: Object.keys(pkg.dependencies)
          .map(p => ({ title: p }))
          .concat({ title: pkg.name }),
        edges: Object.keys(pkg.dependencies).map(p => ({ source: pkg.name, target: p }))
      }
    };
  };

  // GRAPH CRUD METHODS //

  newNode = node => {
    this.setState((prevState, props) => {
      prevState.pkg.dependencies[node.title] = 'latest';
      return {
        pkg: prevState.pkg
      };
    });
  };

  // END GRAPH CRUD METHODS //

  render() {
    return (
      <MuiThemeProvider theme={this.createTheme()}>
        <CssBaseline />
        <App
          {...this.props}
          updateTheme={this.updateTheme}
          nightMode={this.state.nightMode}
          pkg={this.parsePackage(this.state.pkg)}
          newNode={this.newNode}
        />
      </MuiThemeProvider>
    );
  }
}
