import React, { Component } from 'react';
// Material-UI
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import 'typeface-roboto';

// Lattice
import Widget from '@latticejs/widgets/Widget';

// Custom Style
const styles = theme => ({
  root: {
    flexGrow: 1
  },
  widget: {
    padding: theme.spacing.unit * 4,
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
});

class App extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container alignItems="center" direction="column" align="center">
          <Widget className={classes.widget} title="Introduction" border="bottom">
            <Typography variant="subheading">Welcome to Lattice</Typography>
          </Widget>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(App);
