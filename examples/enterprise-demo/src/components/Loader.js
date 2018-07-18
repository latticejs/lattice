import React from 'react';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
  root: {
    height: '100vh'
  },
  progress: {
    width: '100%'
  }
});

function Loader({ classes, loading, component = 'linear', children }) {
  if (loading) {
    return (
      <Grid container className={classes.root} spacing={16} alignItems="center" justify="center">
        {component === 'linear' && <LinearProgress className={classes.progress} />}
        {component === 'circular' && <CircularProgress className={classes.progress} size={50} />}
      </Grid>
    );
  }

  return children;
}

export default withStyles(styles)(Loader);
