import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
  root: {
    height: '100%',
    flexGrow: 1
  },
  fullscreen: {
    height: '100vh',
    width: '100vw'
  },
  linear: {
    width: '100%'
  }
});

function InnerLoader({ classes, loading, component, fullscreen, className, children }) {
  let render;
  if (component === 'linear') {
    render = <LinearProgress className={classes.linear} />;
  } else if (component === 'circular') {
    render = <CircularProgress size={50} />;
  } else {
    render = component();
  }

  const _className = classnames(className, classes.root, {
    [classes.fullscreen]: fullscreen
  });

  if (loading) {
    return (
      <Grid container className={_className} alignItems="center" justify="center">
        {render}
      </Grid>
    );
  }

  if (children) {
    return children;
  }

  return null;
}

const LoaderStyled = withStyles(styles)(InnerLoader);

const Loader = props => <LoaderStyled {...props} />;

export default Loader;

Loader.propTypes = {
  component: PropTypes.oneOfType([PropTypes.oneOf(['circular', 'linear']), PropTypes.func]),
  loading: PropTypes.bool,
  fullscreen: PropTypes.bool,
  children: PropTypes.element
};

Loader.defaultProps = {
  component: 'circular',
  fullscreen: false
};
