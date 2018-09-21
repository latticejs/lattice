import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const styles = theme => ({
  root: {
    ...theme.typography.button,
    padding: theme.spacing.unit,
    width: '1em',
    fontSize: '1rem'
  },
  bold: {
    fontWeight: 'bold'
  }
});

const Icon = withStyles(styles)(({ classes, bold = false, ...props }) => {
  return <pre className={classnames(classes.root, { [classes.bold]: bold })} {...props} />;
});

export const JSONIcon = props => {
  let content = '';
  switch (props.type) {
    case 'string':
      content = ' S ';
      break;
    case 'number':
      content = ' N ';
      break;
    case 'date':
      content = ' D ';
      break;
    case 'object':
      content = '{ }';
      break;
    case 'array':
      content = '[ ]';
      break;
    default:
      break;
  }

  return <Icon {...props}>{content}</Icon>;
};

export default () => null;
