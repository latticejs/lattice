import React, { Component } from 'react';

// Material-UI
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

// @lattice
import Widget from '@lattice/widgets/Widget';

class General extends Component {
  render () {
    return (
      <Grid container spacing={24}>
        <Grid item xs={12} lg={6} >
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
        <Grid item xs={12} lg={6} >
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Widget title="Buttons Primary">
                <Button color="primary">Primary</Button>
                <Button color="primary" variant="raised">Primary Raised</Button>
                <Button color="primary" variant="fab">fab</Button>
                <Button color="primary" variant="fab" mini>-</Button>
              </Widget>
            </Grid>
            <Grid item xs={12}>
              <Widget title="Buttons Secondary">
                <Button color="secondary">Secondary</Button>
                <Button color="secondary" variant="raised">Secondary Raised</Button>
                <Button color="secondary" variant="fab">fab</Button>
                <Button color="secondary" variant="fab" mini>-</Button>
              </Widget>
            </Grid>
            <Grid item xs={12}>
              <Widget title="Buttons Default">
                <Button color="default">Default</Button>
                <Button color="default" variant="raised">Default Raised</Button>
                <Button color="default" variant="fab">fab</Button>
                <Button color="default" variant="fab" mini>-</Button>
              </Widget>
            </Grid> 
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default General;
