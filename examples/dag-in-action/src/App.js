import React, { Component } from 'react';
// Material-UI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

// Material icons
import DayIcon from '@material-ui/icons/WbSunnyOutlined';
import NightIcon from '@material-ui/icons/Brightness3Outlined';

import 'typeface-roboto';

// Lattice
import Dag from '@latticejs/dag';
import Widget from '@latticejs/widgets/Widget';

// Custom Style
const styles = theme => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flexGrow: 1
  },
  appBar: {
    backgroundColor: theme.palette.primary[theme.palette.type],
    color: theme.palette.primary.contrastText
  },
  widget: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  link: {
    color: theme.palette.text.secondary
  }
});

class App extends Component {
  static defaultProps = {
    width: 800,
    height: 600
  };

  state = {
    nodeData: false,
    results: []
  };

  handleNightModeChange = () => {
    const { updateTheme, nightMode } = this.props;
    updateTheme(!nightMode);
  };

  newDep = node => {
    // call parent cb
    this.props.newNode({
      title: node.title
    });
  };

  render() {
    const { classes, nightMode, pkg, width, height } = this.props;
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
        <Grid container>
          <Grid item xs={12}>
            <Grid container justify="space-around" spacing={Number('16')}>
              <Grid item>
                <Widget title={pkg.name} className={classes.widget}>
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
              <Grid item>
                {this.state.nodeData ? (
                  <Widget title="New dep" featured={true} className={classes.widget}>
                    {this.state.nodeData.title}
                  </Widget>
                ) : (
                  ''
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(App);
