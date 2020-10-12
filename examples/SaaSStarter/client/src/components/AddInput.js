import { makeStyles } from '@material-ui/core/styles';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

const noOpp = () => {};

const AddInput = ({ value = '', onChange = noOpp, onAdd = noOpp }) => {
  const classes = useStyles();

  const onSubmit = (e) => {
    e.preventDefault();
    onAdd();
  };

  return (
    <Paper component="form" onSubmit={onSubmit} className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder="Add Option"
        inputProps={{ 'aria-label': 'Add Option' }}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
      <Divider className={classes.divider} orientation="vertical" />
      <IconButton color="primary" className={classes.iconButton} aria-label="add" onClick={onAdd}>
        <AddBoxIcon />
      </IconButton>
    </Paper>
  );
};

export default AddInput;
