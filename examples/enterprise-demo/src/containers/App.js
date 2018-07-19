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

// @latticejs
import { Loader } from '@latticejs/widgets';

// stores
import { getUi } from '../stores/ui';

// Ours
import { SIGN_IN, MAIN } from './routes';
import { withCurrentUser } from './Auth';
import PrivateRoute from './PrivateRoute';
import Login from './Login';
import Main from './Main';

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
    const { refetchUser, currentUser, loadingUser } = this.props;

    return (
      <BrowserRouter>
        <MuiThemeProvider theme={this.createTheme()}>
          <CssBaseline>
            <Loader loading={!currentUser && loadingUser}>
              <Switch>
                <Route
                  path={SIGN_IN}
                  component={props => <Login {...props} refetchUser={refetchUser} currentUser={currentUser} />}
                />
                <PrivateRoute path={MAIN} component={Main} />
              </Switch>
            </Loader>
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
  }),
  withCurrentUser
)(App);
