import React from 'react';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  content: {
    flex: 2
  },
  container: {
    height: '100%'
  }
});

function Widget({ title, children, classes, className }) {
  let renderTitle;
  if (title) {
    if (typeof title === 'string') {
      renderTitle = (
        <Typography variant="headline" gutterBottom>
          {title}
        </Typography>
      );
    } else {
      renderTitle = renderTitle();
    }
  }

  return (
    <Paper className={classNames(className, classes.root)}>
      <Grid container direction="column" className={classes.container}>
        {renderTitle && <Grid item>{renderTitle}</Grid>}
        <Grid container item className={classes.content}>
          {children}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default withStyles(styles)(Widget);
