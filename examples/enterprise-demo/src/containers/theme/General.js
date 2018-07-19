import React, { Component } from 'react';

// Material-UI
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

// @latticejs
import Widget from '@latticejs/widgets/Widget';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  }
});

class General extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Grid container spacing={24}>
        <Grid item xs={12} lg={6}>
          <Widget title="Typography">
            <Typography variant="display4">Display4</Typography>
            <Typography variant="display3">Display3</Typography>
            <Typography variant="display2">Display2</Typography>
            <Typography variant="display1">Display1</Typography>
            <Typography variant="headline">Headline</Typography>
            <Typography variant="title">Title</Typography>
            <Typography variant="subheading">SubHeading</Typography>
            <Typography variant="caption">Caption</Typography>
            <Typography variant="body2">Body2</Typography>
            <Typography variant="body1">Body1</Typography>
            <Typography variant="button">Button</Typography>
          </Widget>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Widget title="Buttons Primary">
                <Button color="primary" className={classes.button}>
                  Primary
                </Button>
                <Button color="primary" variant="raised" className={classes.button}>
                  Primary Raised
                </Button>
                <Button color="primary" variant="fab" className={classes.button}>
                  fab
                </Button>
                <Button color="primary" variant="fab" mini className={classes.button}>
                  -
                </Button>
              </Widget>
            </Grid>
            <Grid item xs={12}>
              <Widget title="Buttons Secondary">
                <Button color="secondary" className={classes.button}>
                  Secondary
                </Button>
                <Button color="secondary" variant="raised" className={classes.button}>
                  Secondary Raised
                </Button>
                <Button color="secondary" variant="fab" className={classes.button}>
                  fab
                </Button>
                <Button color="secondary" variant="fab" mini className={classes.button}>
                  -
                </Button>
              </Widget>
            </Grid>
            <Grid item xs={12}>
              <Widget title="Buttons Default">
                <Button color="default" className={classes.button}>
                  Default
                </Button>
                <Button color="default" variant="raised" className={classes.button}>
                  Default Raised
                </Button>
                <Button color="default" variant="fab" className={classes.button}>
                  fab
                </Button>
                <Button color="default" variant="fab" mini className={classes.button}>
                  -
                </Button>
              </Widget>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(General);
