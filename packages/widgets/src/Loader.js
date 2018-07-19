import React from 'react';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
  root: {
    height: '100vh',
    flexGrow: 1
  },
  linear: {
    width: '100%'
  }
});

function Loader({ classes, loading, component = 'linear', children }) {
  let render;
  if (component === 'linear') {
    render = <LinearProgress className={classes.linear} />;
  } else if (component === 'circular') {
    render = <CircularProgress size={50} />;
  } else {
    render = component();
  }

  if (loading) {
    return (
      <Grid container className={classes.root} alignItems="center" justify="center">
        {render}
      </Grid>
    );
  }

  return children;
}

export default withStyles(styles)(Loader);
