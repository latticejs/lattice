import './css/font.css';
import './css/loader.scss';
import 'typeface-roboto';
import { ApolloProvider } from '@apollo/react-hooks';
import { Box, CssBaseline } from '@material-ui/core';
import { CommonContextProvider, OrgContextProvider } from './context';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import { ToastContainer } from 'react-toastify';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import Loader from 'react-loaders';

import { useAuth0 } from './react-auth0-spa';
import ApolloClient from 'apollo-client';
import Org from './Org';
import OrgList from './OrgList';
import PrivateRoute from './PrivateRoute';
import React from 'react';
import TopNav from './TopNav';
import UserProfile from './UserProfile';

// Theme
const theme = createMuiTheme({
  palette: {
    background: {
      default: '#F2F5F8',
    },
    primary: {
      main: '#00a6fb',
      light: '#00a6fb55',
    },
    secondary: {
      main: '#003554',
      light: '#051923',
    },
    tonalOffset: 0.1,
  },
  typography: {
    h1: {
      fontFamily: 'Gilroy-Semibold',
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: 24,
    },
    h2: {
      fontSize: 22,
      fontFamily: 'Gilroy-Semibold',
      fontWeight: 500,
    },
    h3: {
      fontSize: 20,
      fontFamily: 'Gilroy-Bold',
      fontWeight: 600,
    },
    h4: {
      fontSize: 18,
      fontFamily: 'Gilroy-Semibold',
      fontWeight: 500,
    },
    h5: {
      fontSize: 16,
      fontFamily: 'Gilroy-Semibold',
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: 16,
      fontFamily: 'Gilroy-Medium',
      fontWeight: 400,
    },
    subtitle2: {
      fontSize: 16,
      fontFamily: 'Gilroy-Regular',
      fontWeight: 300,
    },
    body1: {
      fontWeight: 500,
      fontSize: 14,
      fontFamily: 'Gilroy-Semibold',
    },
    body2: {
      fontWeight: 400,
      fontSize: 14,
      fontFamily: 'Gilroy-Medium',
    },

    fontFamily: [
      'Gilroy',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    spacing: 8,
  },
});
// Custom Style
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  widget: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  link: {
    color: theme.palette.text.secondary,
  },
  buttonGroup: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  loaderWrapper: {
    zIndex: 9,
  },
  loader: {
    transform: 'scale(1.5)',
  },
}));

const createApolloClient = (authToken) =>
  new ApolloClient({
    link: new HttpLink({
      uri: process.env.REACT_APP_GRAPH_QL_END_POINT,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }),
    cache: new InMemoryCache(),
    connectToDevTools: true,
  });

const App = () => {
  const classes = useStyles();

  const showLoader = (status) => {
    if (!status) {
      return '';
    }
    return (
      <div id="overlay" className={classes.loaderWrapper}>
        <div id="loader">
          <Loader type="line-scale" className={classes.loader} />
        </div>
      </div>
    );
  };

  const { idToken, loading } = useAuth0();

  if (loading) {
    return showLoader(true);
  }

  const client = createApolloClient(idToken);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer />
      <div className={classes.root}>
        <ApolloProvider client={client}>
          <Router>
            <OrgContextProvider idToken={idToken}>
              <TopNav />
              <Box mt={8}>
                <Switch>
                  <PrivateRoute exact path="/profile">
                    <UserProfile showLoader={showLoader} />
                  </PrivateRoute>
                  <PrivateRoute exact path="/">
                    <CommonContextProvider>
                      <OrgList showLoader={showLoader} />
                    </CommonContextProvider>
                  </PrivateRoute>
                  <PrivateRoute path="/:orgID/">
                    <Org showLoader={showLoader} />
                  </PrivateRoute>
                </Switch>
              </Box>
            </OrgContextProvider>
          </Router>
        </ApolloProvider>
      </div>
    </ThemeProvider>
  );
};
export default App;
