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
// Dropzone
import Dropzone from 'react-dropzone';
// container dimensions
import ContainerDimensions from 'react-container-dimensions';
// react json view
import ReactJson from 'react-json-view';
// classnames
import classnames from 'classnames';
// Lattice
import Dag from '@latticejs/dag';
import { Widget, Loader } from '@latticejs/widgets';

// Custom Style
const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  flex: {
    flex: 1
  },
  main: {
    padding: 20,
    flex: 1
  },
  container: {
    flex: 1
  },
  footer: {
    padding: 20
  },
  flexColumnItem: {
    display: 'flex',
    flex: 1,
    height: 300,
    maxHeight: '50vh'
  },
  appBar: {
    backgroundColor: theme.palette.primary[theme.palette.type],
    color: theme.palette.primary.contrastText
  },
  overflow: {
    overflow: 'auto'
  },
  columnWidget: {
    display: 'flex',
    flex: 1,
    overflow: 'scroll'
  },
  columnItemTop: {
    marginBottom: 5
  },
  columnItemBottom: {
    marginTop: 5
  },
  dagWidget: {
    height: '100vh'
  },
  customBorderNoResults: {
    borderColor: 'yellow'
  },
  customBorderError: {
    borderColor: 'red'
  },
  link: {
    color: theme.palette.text.secondary
  },
  dropzone: {
    width: '100%',
    height: '100%'
  },
  instructions: {
    width: '500px',
    maxWidth: '100%'
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
  mutation UpdatePkg($pkg: PkgInput!) {
    updatePkg(pkg: $pkg) {
      name
      version
      description
      dependencies
      devDependencies
      peerDependencies
      optionalDependencies
      bundledDependencies
      engines
      os
      cpu
      private
      publishConfig
      keywords
      bugs {
        url
      }
      license
      author {
        name
      }
      contributors {
        name
      }
      files
      main
      browser
      bin
      repository {
        url
      }
      scripts
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

  onDrop = (accepted, rejected, updatePkg) => {
    if (accepted && accepted[0].name !== 'package.json') return;
    if (!window.FileReader) return;

    const pkgFile = accepted[0];
    const reader = new FileReader();

    reader.onload = event => {
      const { result } = event.target;
      const pkg = JSON.parse(result);
      pkg.dependencies = JSON.stringify(pkg.dependencies || {});
      pkg.devDependencies = JSON.stringify(pkg.devDependencies || {});
      pkg.peerDependencies = JSON.stringify(pkg.peerDependencies || {});
      pkg.optionalDependencies = JSON.stringify(pkg.optionalDependencies || {});
      if (pkg.bin) {
        pkg.bin = JSON.stringify(pkg.bin);
      }
      if (pkg.scripts) {
        pkg.scripts = JSON.stringify(pkg.scripts);
      }
      if (pkg.engines) {
        pkg.engines = JSON.stringify(pkg.engines);
      }
      if (pkg.publishConfig) {
        pkg.publishConfig = JSON.stringify(pkg.publishConfig);
      }
      pkg.author = pkg.author || {};
      pkg.contributors = pkg.contributors || [];
      pkg.bugs = pkg.bugs || {};
      pkg.repository = pkg.repository || {};

      updatePkg({
        variables: { pkg },
        refetchQueries: [{ query: this.props.refreshQuery }]
      });
    };

    reader.onerror = err => {
      console.log(err);
    };

    reader.readAsText(pkgFile);
  };

  parseExport = pkg => {
    const newPkg = JSON.parse(JSON.stringify(pkg));

    Object.keys(newPkg).forEach(key => {
      if (!newPkg[key]) {
        delete newPkg[key];
      }
    });
    delete newPkg['__typename'];
    return newPkg;
  };

  render() {
    const { classes, nightMode, pkg, originalPkg } = this.props;
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
          <Grid container justify="space-between" alignItems="stretch" spacing={8} className={classes.container}>
            <Grid item xs={12} md={8} lg={8}>
              <Widget title={pkg.name} className={classes.dagWidget}>
                <Mutation mutation={UPDATE_DEPS}>
                  {updatePkg => (
                    <Dropzone
                      disableClick
                      className={classes.dropzone}
                      accept="application/json"
                      onDrop={(accept, rejected) => this.onDrop(accept, rejected, updatePkg)}
                    >
                      <ContainerDimensions>
                        {({ width, height }) => (
                          <Dag
                            editable={true}
                            width={width}
                            height={height}
                            nodes={pkg.data.nodes}
                            edges={pkg.data.edges}
                            onNodeAdded={this.newDep}
                            nodeRadius={45}
                          />
                        )}
                      </ContainerDimensions>
                    </Dropzone>
                  )}
                </Mutation>
              </Widget>
            </Grid>
            <Grid item xs={12} md={4} lg={4} zeroMinWidth container direction="column" className={classes.columns}>
              <Grid item className={classnames([classes.flexColumnItem, classes.columnItemTop])}>
                <Widget title="Exported Pkg" className={classes.columnWidget}>
                  <ReactJson src={this.parseExport(this.props.originalPkg)} name={false} />
                </Widget>
              </Grid>
              <Grid item className={classnames([classes.flexColumnItem, classes.columnItemBottom])}>
                <Widget title="NPM results" className={classes.columnWidget}>
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
                                              pkg: {
                                                name: originalPkg.name,
                                                dependencies: JSON.stringify(originalPkg.dependencies)
                                              }
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
                    <div />
                  )}
                </Widget>
              </Grid>
            </Grid>
          </Grid>
        </div>
        <Grid item xs={12} md={12} lg={12} className={classes.footer}>
          <Widget title="Instructions" className={classes.instructions}>
            <ul>
              <li>
                <Typography variant="body1" gutterBottom>
                  You can drag and drop a <code>package.json</code> file
                </Typography>
              </li>
              <li>
                <Typography variant="body1" gutterBottom>
                  Add new deps: double click anywhere on the graph, then select your dep
                </Typography>
              </li>
            </ul>
          </Widget>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(App);
