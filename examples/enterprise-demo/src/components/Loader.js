import React from 'react';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
  root: {
    height: '100vh'
  },
  progress: {
    width: '100%'
  }
});

function Loader({ classes, loading, children }) {
  if (loading) {
    return (
      <Grid container className={classes.root} spacing={16} alignItems="center" justify="center">
        <LinearProgress className={classes.progress} />
      </Grid>
    );
  }

  return children;
}

export default withStyles(styles)(Loader);
