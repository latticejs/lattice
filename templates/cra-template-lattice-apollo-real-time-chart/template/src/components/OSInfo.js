import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import { Widget } from '@latticejs/widgets';

const styles = (theme) => ({
  root: {
    height: '100%',
  },
});

function OSInfo({ data, classes }) {
  return (
    <Widget title="Platform" classes={classes}>
      <Grid container justify="center" alignItems="center" direction="column" spacing={0}>
        <Grid item>
          <Typography variant="h3">{data.osName}</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h4">{data.osDistro}</Typography>
        </Grid>
      </Grid>
    </Widget>
  );
}

export default withStyles(styles)(OSInfo);
