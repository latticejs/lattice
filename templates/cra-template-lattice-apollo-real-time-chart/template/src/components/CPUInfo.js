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

function CPUInfo({ data, classes }) {
  return (
    <Widget title="CPU Info" classes={classes}>
      <Grid container justify="center" alignItems="center" direction="column" spacing={8}>
        <Grid item>
          <Typography variant="body1">
            Manufacturer: <strong>{data.cpuManufacturer}</strong>
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">
            Brand: <strong>{data.cpuBrand}</strong>
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">
            Speed: <strong>{data.cpuSpeed}</strong>
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">
            Cores: <strong>{data.cpuCores}</strong>
          </Typography>
        </Grid>
      </Grid>
    </Widget>
  );
}

export default withStyles(styles)(CPUInfo);
