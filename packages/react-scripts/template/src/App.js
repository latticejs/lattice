import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Widget } from '@latticejs/widgets';

export default class App extends Component {
  render() {
    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <Widget featured title="Hello from Lattice App">
            <Typography variant="body1" color="inherit">
              Welcome to your first Lattice App!
            </Typography>
          </Widget>
        </Grid>
        <Grid item xs={6}>
          <Widget border="bottom" title="Edit">
            <Typography variant="body1">Edit your App.js file to see changes in this page!</Typography>
          </Widget>
        </Grid>
        <Grid item xs={6}>
          <Widget border="bottom" title="Material UI">
            <Typography variant="body1">@material-ui/core and @material-ui/icons are included by default!</Typography>
          </Widget>
        </Grid>
      </Grid>
    );
  }
}
