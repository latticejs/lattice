import React from 'react';

// Material-UI
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

// @latticejs
import { Widget } from '@latticejs/widgets';

const styles = (theme) => ({
  borderWidth: {
    borderWidth: 8,
  },
  borderRed: {
    borderColor: 'red',
  },
  featuredRed: {
    backgroundColor: 'red',
  },
});

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum. A pellentesque sit amet porttitor eget. Aenean sed adipiscing diam donec adipiscing tristique risus.`;

const widgets = (props) => {
  const { classes } = props;
  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <Widget title="Normal Widget">
          <Typography variant="body1">{lorem}</Typography>
        </Widget>
      </Grid>
      <Grid item xs={6}>
        <Widget title="Border Widget" border="top">
          <Typography variant="body1">{lorem}</Typography>
        </Widget>
      </Grid>
      <Grid item xs={6}>
        <Widget title="Custom Border Color Widget" border="top" classes={{ border: classes.borderRed }}>
          <Typography variant="body1">{lorem}</Typography>
        </Widget>
      </Grid>
      <Grid item xs={6}>
        <Widget title="Custom Border Width Widget" border="bottom" classes={{ border: classes.borderWidth }}>
          <Typography variant="body1">{lorem}</Typography>
        </Widget>
      </Grid>
      <Grid item xs={12}>
        <Widget title="Featured Widget" featured>
          <Typography variant="body1" color="inherit">
            {lorem}
          </Typography>
        </Widget>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(widgets);
