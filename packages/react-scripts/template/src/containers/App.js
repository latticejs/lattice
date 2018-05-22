import React, { Component } from 'react';

// Material-UI
import { createMuiTheme } from '@material-ui/core/styles';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';

// Router
import { BrowserRouter , Route, Switch } from 'react-router-dom';

// Apollo
import { compose, graphql } from 'react-apollo';

// Typeface
import 'typeface-roboto';

import Login from './Login';
import Main from './Main';
import PrivateRoute from './PrivateRoute';
import ui from '../queries/ui';

class App extends Component {
  state = {
    muiTheme: {
      palette: {
        type: this.props.nightMode ? 'dark' : 'light'
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
      <BrowserRouter>
        <MuiThemeProvider theme={createMuiTheme(muiTheme)}>
          <CssBaseline>
            <Switch>
              <Route path="/login" component={Login}/>
              <PrivateRoute path="/" component={Main}/>
            </Switch>
          </CssBaseline>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default compose(
  graphql(ui, {
    props: ({ data: { ui: { nightMode } } }) => ({ nightMode })
  })
)(App);
