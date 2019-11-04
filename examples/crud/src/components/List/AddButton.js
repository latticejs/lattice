import React from 'react';
import { withStyles, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const AddButton = ({ classes, children, ...props }) => (
  <Button color="primary" variant="contained" className={classes.button} {...props}>
    <AddIcon className={classes.leftIcon} />
    {children}
  </Button>
);

const styles = withStyles(theme => ({
  button: {
    ...theme.palette.primary,
    margin: theme.spacing(1)
  },
  leftIcon: {
    marginRight: theme.spacing(1)
  }
}));

export default styles(AddButton);
