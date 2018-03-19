import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

// Material-UI
import { createMuiTheme } from 'material-ui/styles';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CssBaseline from 'material-ui/CssBaseline';

// Router
import { Route, Switch } from 'react-router-dom';

// Typeface
import 'typeface-roboto';

import { history } from '../store';
import Login from './Login';
import Main from './Main';
import PrivateRoute from './PrivateRoute';


class App extends Component {
  state = {
    muiTheme: {
      palette: {
      },
      typography: {
        title: {
          fontWeight: 300
        }
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    const { nightMode: prevNightMode } = this.props;
    const { nightMode } = nextProps;

    if (nightMode !== prevNightMode) {
      const { muiTheme } = this.state;
      this.setState({
        muiTheme: {
          ...muiTheme,
          palette: {
            ...muiTheme.palette,
            type: nightMode ? 'dark' : 'light'
          }
        }        
      })
    }

  }

  render() {
    const { muiTheme } = this.state;
    return (
      <ConnectedRouter history={history}>
        <MuiThemeProvider theme={createMuiTheme(muiTheme)}>
          <CssBaseline>
            <Switch>
              <Route path="/login" component={Login}/>
              <PrivateRoute path="/" component={Main}/>
            </Switch>
          </CssBaseline>
        </MuiThemeProvider>
      </ConnectedRouter>
    );
  }
}

export default connect(
  ({ ui: { nightMode } }) => ({ nightMode })
)(App);
