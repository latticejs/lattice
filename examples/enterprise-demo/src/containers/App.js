import React, { Component } from 'react';

// Material-UI
import { createMuiTheme } from '@material-ui/core/styles';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';

// Router
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Apollo
import { compose, graphql } from 'react-apollo';

// Typeface
import 'typeface-roboto';

import * as routes from '../constants/routes';
import Login from './Login';
//import Main from './Main';
//import PrivateRoute from './PrivateRoute';
import { getUi } from '../stores/ui';

class App extends Component {
  createTheme() {
    const { nightMode } = this.props;

    return createMuiTheme({
      palette: {
        type: nightMode ? 'dark' : 'light'
      }
    });
  }

  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider theme={this.createTheme()}>
          <CssBaseline>
            <Switch>
              <Route path="/login" component={Login} />
            </Switch>
          </CssBaseline>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default compose(
  graphql(getUi, {
    props: ({
      data: {
        ui: { nightMode }
      }
    }) => ({ nightMode })
  })
)(App);
