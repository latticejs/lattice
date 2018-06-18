import React from 'react';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters({
      padding: '30px 0',
      flex: '1 1 100%',
      maxWidth: '100%',
      margin: '0 auto'
    })
  },
  [theme.breakpoints.up(1200 + theme.spacing.unit * 6)]: {
    root: {
      maxWidth: 1200
    }
  }
});

const Content = ({ classes, children }) => {
  return <div className={classes.root}>{children}</div>;
};

export default withStyles(styles)(Content);
