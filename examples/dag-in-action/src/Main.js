import React, { Component } from 'react';
// Material-UI
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme } from '@material-ui/core/styles';
// Apollo | gql deps
import ApolloClient from 'apollo-boost';
import { ApolloProvider, Query } from 'react-apollo';
import gql from 'graphql-tag';
// Lattice
import { Widget, Loader } from '@latticejs/widgets';

// our App
import App from './App';

// gql: create the client
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
});

// gql:queries
const QUERY_PKG = gql`
  query QueryPkg {
    pkg {
      name
      version
      description
      dependencies
      devDependencies
      scripts
      author {
        name
      }
      contributors {
        name
      }
      keywords
      repository {
        url
      }
      bugs {
        url
      }
    }
  }
`;

// END gql:queries

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

  parsePackage = pkg => {
    if (!pkg.dependencies) return;
    const deps = JSON.parse(pkg.dependencies);
    return {
      name: pkg.name,
      data: {
        nodes: Object.keys(deps)
          .map(p => ({ title: p }))
          .concat({ title: pkg.name }),
        edges: Object.keys(deps).map(p => ({ source: pkg.name, target: p }))
      }
    };
  };

  parseOriginal = pkg => {
    if (!pkg.dependencies) return;
    pkg.dependencies = JSON.parse(pkg.dependencies);
    return pkg;
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
  renderError = error => (
    <Widget title="Error" border="bottom">
      {error.message}
    </Widget>
  );

  render() {
    return (
      <ApolloProvider client={client}>
        <MuiThemeProvider theme={this.createTheme()}>
          <CssBaseline />
          <Query query={QUERY_PKG}>
            {({ loading, error, data }) => {
              if (error) return this.renderError(error);
              const pkg = data && data.pkg && data.pkg.dependencies ? data.pkg : {};
              return (
                <Loader loading={loading} component="linear">
                  <App
                    {...this.props}
                    updateTheme={this.updateTheme}
                    nightMode={this.state.nightMode}
                    pkg={this.parsePackage(pkg)}
                    newNode={this.newNode}
                    originalPkg={this.parseOriginal(pkg)}
                    refreshQuery={QUERY_PKG}
                  />
                </Loader>
              );
            }}
          </Query>
        </MuiThemeProvider>
      </ApolloProvider>
    );
  }
}
