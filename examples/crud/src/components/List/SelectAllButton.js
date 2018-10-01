import React from 'react';
import { withStyles, FormControl, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';

const SelectAll = ({ checked, onChange, classes }) => {
  return (
    <FormControl component="fieldset" className={classes.formControl}>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox checked={checked} onChange={onChange} />}
          label="Select all"
          classes={{ root: classes.check, label: classes.label }}
        />
      </FormGroup>
    </FormControl>
  );
};

const styles = theme => ({
  formControl: {
    marginLeft: theme.spacing.unit * 3
  },
  check: {
    marginLeft: 0
  },
  label: {
    ...theme.typography.button,
    marginLeft: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(SelectAll);
