import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

// Material-UI
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    color: theme.palette.text.secondary,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  container: {
    height: '100%'
  },
  content: {
    fontFamily: theme.typography.fontFamily,
    flex: 1
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

const Widget = ({ title, featured, elevation, classes, border, rounded, className, children, ...props }) => {
  const rootClasses = [classes.root];

  if (border) {
    rootClasses.push(classes.border, classes[`border-${border}`]);
  }

  if (featured) {
    rootClasses.push(classes.featured);
  }

  let renderTitle;
  if (title) {
    if (typeof title === 'string') {
      renderTitle = (
        <Typography variant="title" color="inherit" gutterBottom>
          {title}
        </Typography>
      );
    } else {
      renderTitle = title();
    }
  }

  return (
    <Paper className={classnames(className, ...rootClasses)} elevation={elevation} square={!rounded} {...props}>
      <Grid container direction="column" className={classes.container}>
        {renderTitle && <Grid item>{renderTitle}</Grid>}
        <Grid container item className={classes.content}>
          {children}
        </Grid>
      </Grid>
    </Paper>
  );
};

Widget.defaultProps = {
  title: null,
  featured: false,
  elevation: 2,
  classes: {},
  border: null,
  rounded: true
};

Widget.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  featured: PropTypes.bool,
  elevation: PropTypes.number,
  classes: PropTypes.object,
  border: PropTypes.oneOf(['top', 'bottom', 'right', 'left']),
  rounded: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

export default withStyles(styles, { name: 'Widget' })(Widget);
