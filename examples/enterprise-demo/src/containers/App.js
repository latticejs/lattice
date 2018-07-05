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

// components
import PrivateRoute from './PrivateRoute';

// Pages
import { SIGN_IN, MAIN } from './routes';
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
    return (
      <BrowserRouter>
        <MuiThemeProvider theme={this.createTheme()}>
          <CssBaseline>
            <Switch>
              <Route path={SIGN_IN} component={Login} />
              <PrivateRoute path={MAIN} component={Main} />
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
