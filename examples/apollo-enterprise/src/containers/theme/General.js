import React from 'react';

// Material-UI
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

// @latticejs
import { Widget } from '@latticejs/widgets';

const styles = (theme) => ({
  button: {
    margin: theme.spacing(1),
  },
});

const General = (props) => {
  const { classes } = props;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={6}>
        <Widget title="Typography">
          <Typography variant="h1">h1</Typography>
          <Typography variant="h2">h2</Typography>
          <Typography variant="h3">h3</Typography>
          <Typography variant="h4">h4</Typography>
          <Typography variant="h5">h5</Typography>
          <Typography variant="h6">h6</Typography>
          <Typography variant="subtitle1">subtitle1</Typography>
          <Typography variant="subtitle2">subtitle2</Typography>
          <Typography variant="body2">Body2</Typography>
          <Typography variant="body1">Body1</Typography>
          <Typography variant="caption">Button</Typography>
          <Typography variant="button">button</Typography>
          <Typography variant="overline">overline</Typography>
          <Typography variant="srOnly">srOnly</Typography>
          <Typography variant="inherit">inherit</Typography>
        </Widget>
      </Grid>
      <Grid item xs={12} lg={6}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Widget title="Buttons Primary">
              <Button color="primary" className={classes.button}>
                Primary
              </Button>
              <Button color="primary" variant="contained" className={classes.button}>
                Primary Contained
              </Button>
              <Button color="primary" variant="outlined" className={classes.button}>
                fab
              </Button>
            </Widget>
          </Grid>
          <Grid item xs={12}>
            <Widget title="Buttons Secondary">
              <Button color="secondary" className={classes.button}>
                Secondary
              </Button>
              <Button color="secondary" variant="contained" className={classes.button}>
                Secondary Contained
              </Button>
              <Button color="secondary" variant="outlined" className={classes.button}>
                fab
              </Button>
            </Widget>
          </Grid>
          <Grid item xs={12}>
            <Widget title="Buttons Default">
              <Button color="default" className={classes.button}>
                Default
              </Button>
              <Button color="default" variant="contained" className={classes.button}>
                Default Contained
              </Button>
              <Button color="default" variant="outlined" className={classes.button}>
                fab
              </Button>
            </Widget>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(General);
