import React from 'react';
import classnames from 'classnames';

// Material-UI
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    color: theme.palette.text.secondary,
    padding: 16
  },
  border: {
    borderColor: theme.palette.primary.main,
    borderWidth: 4
  },
  'border-top': {
    borderTopStyle: 'solid'
  },
  'border-bottom': {
    borderBottomStyle: 'solid'
  },
  featured: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.getContrastText(theme.palette.primary.main)
  }
});

const Widget = ({ children, elevation = 2, className, classes, title, border, featured, ...props }) => {
  const rootClasses = [classes.root];

  if (border) {
    rootClasses.push(classes.border, classes[`border-${border}`]);
  }
  if (featured) {
    rootClasses.push(classes.featured);
  }

  return (
    <Paper className={classnames(className, ...rootClasses)} elevation={elevation} {...props}>
      {title && (
        <Typography variant="title" color="inherit" gutterBottom>
          {title}
        </Typography>
      )}
      {children}
    </Paper>
  );
};

export default withStyles(styles, { name: 'Widget' })(Widget);
