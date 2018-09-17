import React, { Component } from 'react';
// Material-UI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { withStyles } from '@material-ui/core/styles';
// Material icons
import DayIcon from '@material-ui/icons/WbSunnyOutlined';
import NightIcon from '@material-ui/icons/Brightness3Outlined';
import NoteAdd from '@material-ui/icons/NoteAdd';
import 'typeface-roboto';
// GQL
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
// Lattice
import Dag from '@latticejs/dag';
import { Widget, Loader } from '@latticejs/widgets';

// Custom Style
const styles = theme => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flexGrow: 1
  },
  main: {
    padding: 20
  },
  appBar: {
    backgroundColor: theme.palette.primary[theme.palette.type],
    color: theme.palette.primary.contrastText
  },
  customBorderNoResults: {
    borderColor: 'yellow'
  },
  customBorderError: {
    borderColor: 'red'
  },
  link: {
    color: theme.palette.text.secondary
  }
});

// gql:queries

const QUERY_DEPS = gql`
  query QueryDeps($name: String!) {
    dependency(name: $name) {
      name
      version
      description
    }
  }
`;

const UPDATE_DEPS = gql`
  mutation UpdatePkg($name: String!, $dependencies: String!) {
    updatePkg(name: $name, dependencies: $dependencies) {
      name
      dependencies
    }
  }
`;

// END gql:queries

class App extends Component {
  static defaultProps = {
    width: 800,
    height: 600
  };

  state = {
    userDepName: '',
    results: []
  };

  handleNightModeChange = () => {
    const { updateTheme, nightMode } = this.props;
    updateTheme(!nightMode);
  };

  newDep = node => {
    this.setState({
      userDepName: node.title
    });
  };

  selectDep = dep => {
    // call parent cb
    this.props.newNode({
      title: dep.name
    });
  };

  renderNoResults = () => (
    <Widget className={[this.props.classes.customBorderNoResults]} border="bottom">
      No results. :(
    </Widget>
  );

  renderError = error => (
    <Widget className={[this.props.classes.customBorderError]} border="bottom">
      {error.message}
    </Widget>
  );

  render() {
    const { classes, nightMode, pkg, width, height, originalPkg } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <Typography variant="title" color="inherit" className={classes.flex}>
              Dag in Action
            </Typography>
            <Tooltip title="Toggle Night Mode" enterDelay={300}>
              <IconButton onClick={this.handleNightModeChange} color="inherit">
                {nightMode ? <DayIcon /> : <NightIcon />}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <div className={classes.main}>
          <Grid container justify="space-between" alignItems="flex-start" spacing={8}>
            <Grid item xs={12} md={8} lg={8}>
              <Widget title={pkg.name}>
                <Dag
                  editable={true}
                  width={width}
                  height={height}
                  nodes={pkg.data.nodes}
                  edges={pkg.data.edges}
                  onNodeAdded={this.newDep}
                />
              </Widget>
            </Grid>
            <Grid item xs={12} md={4} lg={4} zeroMinWidth>
              {this.state.userDepName ? (
                <Query query={QUERY_DEPS} variables={{ name: this.state.userDepName }}>
                  {({ loading, error, data }) => {
                    if (error) return this.renderError(error);
                    const deps = data && data.dependency ? data.dependency : [];
                    return (
                      <Loader loading={loading} component="linear">
                        <List>
                          {deps.length ? (
                            deps.map((dep, i) => (
                              <Mutation mutation={UPDATE_DEPS} key={i}>
                                {updatePkg => (
                                  <ListItem
                                    button
                                    key={`npm-dep-${i}`}
                                    onClick={() => {
                                      originalPkg.dependencies[dep.name] = dep.version;
                                      updatePkg({
                                        variables: {
                                          name: originalPkg.name,
                                          dependencies: JSON.stringify(originalPkg.dependencies)
                                        },
                                        refetchQueries: [{ query: this.props.refreshQuery }]
                                      });
                                      this.setState({
                                        userDepName: false
                                      });
                                    }}
                                  >
                                    <ListItemIcon>
                                      <NoteAdd />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={`${dep.name} - v${dep.version}`}
                                      secondary={dep.description}
                                    />
                                  </ListItem>
                                )}
                              </Mutation>
                            ))
                          ) : (
                            <ListItem>
                              <ListItemText> No results </ListItemText>
                            </ListItem>
                          )}
                        </List>
                      </Loader>
                    );
                  }}
                </Query>
              ) : (
                ''
              )}
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(App);
