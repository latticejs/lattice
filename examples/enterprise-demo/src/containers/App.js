import React, { Component } from 'react';

// Material-UI
import { createMuiTheme } from '@material-ui/core/styles';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';

// Typeface
import 'typeface-roboto';

// Router
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Apollo
import { compose, graphql } from 'react-apollo';

// stores
import { getUi } from '../stores/ui';

// Pages
import * as routes from '../constants/routes';
import Login from './Login';
//import Main from './Main';

// components

import { withSignOut } from '../components/Auth';
import PrivateRoute from '../components/PrivateRoute';

const Main = withSignOut(({ signOut }) => {
  return <button onClick={signOut}>test</button>;
});

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
              <Route path={routes.SIGN_IN} component={Login} />
              <PrivateRoute path={routes.MAIN} component={Main} />
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
