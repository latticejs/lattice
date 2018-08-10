import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import Widget from './Widget';

const styles = theme => ({
  root: {
    height: '100%'
  }
});

function OSInfo({ data, classes }) {
  return (
    <Widget title="Platform" className={classes.root}>
      <Grid container justify="center" alignItems="center" direction="column" spacing={16}>
        <Grid item>
          <Typography variant="display2">{data.osName}</Typography>
        </Grid>
        <Grid item>
          <Typography variant="display1">{data.osDistro}</Typography>
        </Grid>
      </Grid>
    </Widget>
  );
}

export default withStyles(styles)(OSInfo);
