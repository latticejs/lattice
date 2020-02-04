import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { purple, red, indigo, blue, teal } from '@material-ui/core/colors';

import classnames from 'classnames';

const colorLevel = 200;
const colorLevelBold = 700;

const styles = theme => ({
  root: {
    ...theme.typography.button,
    padding: theme.spacing(0.5),
    width: 'auto',
    fontSize: '0.75rem',
    fontFamily: 'monospace',
    borderRadius: '1rem',
    color: '#ffffff !important'
  },
  string: {
    backgroundColor: teal[colorLevel]
  },
  number: {
    backgroundColor: purple[colorLevel]
  },
  array: {
    backgroundColor: indigo[colorLevel]
  },
  object: {
    backgroundColor: red[colorLevel]
  },
  date: {
    backgroundColor: blue[colorLevel]
  },
  bold: {
    fontWeight: 'bold',
    color: '#ffffff !important'
  },
  bold_string: {
    backgroundColor: teal[colorLevelBold]
  },
  bold_number: {
    backgroundColor: purple[colorLevelBold]
  },
  bold_array: {
    backgroundColor: indigo[colorLevelBold]
  },
  bold_object: {
    backgroundColor: red[colorLevelBold]
  },
  bold_date: {
    backgroundColor: blue[colorLevelBold]
  }
});

const Icon = withStyles(styles)(({ classes, bold = false, className, children, type }) => {
  return (
    <pre
      className={classnames(className, classes.root, classes[type], {
        [classes.bold]: bold,
        [classes[`bold_${type}`]]: bold
      })}
    >
      {children}
    </pre>
  );
});

export const JSONIcon = props => {
  let content = '';
  switch (props.type) {
    case 'string':
      content = ' String ';
      break;
    case 'number':
      content = ' Number ';
      break;
    case 'date':
      content = '  Date  ';
      break;
    case 'object':
      content = '  {  }  ';
      break;
    case 'array':
      content = '  [  ]  ';
      break;
    default:
      break;
  }

  return <Icon {...props}>{content}</Icon>;
};

export default () => null;
