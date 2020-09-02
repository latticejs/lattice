import React from 'react';

// Material-UI
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

// Typeface
import 'typeface-roboto';

// Router
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Apollo
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';

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

const app = (props) => {
  const { refetchUser, currentUser, loadingUser } = props;

  const createTheme = () => {
    const { nightMode } = props;

    return createMuiTheme({
      palette: {
        type: nightMode ? 'dark' : 'light',
      },
      typography: {
        useNextVariants: true,
      },
    });
  };

  return (
    <BrowserRouter>
      <MuiThemeProvider theme={createTheme()}>
        <CssBaseline>
          <Loader loading={!currentUser && loadingUser} component="linear" fullscreen>
            <Switch>
              <Route
                path={SIGN_IN}
                component={(props) => <Login {...props} refetchUser={refetchUser} currentUser={currentUser} />}
              />
              <PrivateRoute path={MAIN} component={Main} />
            </Switch>
          </Loader>
        </CssBaseline>
      </MuiThemeProvider>
    </BrowserRouter>
  );
};

export default compose(
  graphql(getUi, {
    props: ({
      data: {
        ui: { nightMode },
      },
    }) => ({ nightMode }),
  }),
  withCurrentUser
)(app);
