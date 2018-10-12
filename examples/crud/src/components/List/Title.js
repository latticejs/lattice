import { Typography, withStyles } from '@material-ui/core';
import React from 'react';

const styles = theme => ({
  root: {
    display: 'inline',
    marginLeft: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(({ main, secondary, classes }) => (
  <Typography variant="title" color="inherit" gutterBottom>
    {main}
    <Typography variant="body1" color="inherit" classes={classes}>
      {secondary}
    </Typography>
  </Typography>
));
