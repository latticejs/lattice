import React, { Component } from 'react';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/core/styles';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

const styles = theme => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.dark
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  }
});

function InnerNotification(props) {
  const {
    open,
    classes,
    className,
    message,
    onClose,
    variant = 'success',
    autoHideDuration = 2000,
    anchorOrigin = {
      vertical: 'bottom',
      horizontal: 'right'
    },
    ...other
  } = props;
  const Icon = variantIcon[variant];

  return (
    <Snackbar anchorOrigin={anchorOrigin} autoHideDuration={autoHideDuration} open={open} onClose={onClose}>
      <SnackbarContent
        className={classNames(classes[variant], className)}
        message={
          <span id="client-snackbar" className={classes.message}>
            <Icon className={classNames(classes.icon, classes.iconVariant)} />
            {message}
          </span>
        }
        action={[
          <IconButton key="close" aria-label="Close" color="inherit" className={classes.close} onClick={onClose}>
            <CloseIcon className={classes.icon} />
          </IconButton>
        ]}
        {...other}
      />
    </Snackbar>
  );
}

const Notification = withStyles(styles)(InnerNotification);

export class GraphqlErrorNotification extends Component {
  state = {
    message: null,
    lastError: null
  };

  static getDerivedStateFromProps({ error }, state) {
    let message = null;

    if (error && error.graphQLErrors) {
      message = error.graphQLErrors.map(error => error.message).join('\n');
    }

    if (state.lastError === error) {
      return null;
    }

    if (message && !state.message) {
      return {
        lastError: error,
        message
      };
    }

    return null;
  }

  onClose = () => {
    this.setState({ message: null });
  };

  render() {
    const { message } = this.state;

    return <Notification open={!!message} message={message} variant="error" onClose={this.onClose} />;
  }
}

export default Notification;
