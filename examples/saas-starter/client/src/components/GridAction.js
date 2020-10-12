import { Box, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import React, { Fragment } from 'react';

const useStyles = makeStyles((theme) => ({
  deleteBtn: {
    color: '#FF8484',
    cursor: 'pointer',
  },
  iconBtn: {
    borderRadius: 4,
    padding: 8,
    backgroundColor: '#f9f9f9',
    border: '0.5px solid #33333311',
  },
  deleteIcon: {
    color: '#FF6A6A',
  },
}));

const GridAction = (props) => {
  const { openDrawer, deleteHandler, selectedPatient } = props;
  const classes = useStyles();
  const anchor = 'right';

  return (
    <Fragment>
      <Box display="flex">
        <Box order={1}>
          <IconButton
            onClick={openDrawer(anchor, true, selectedPatient)}
            className={classes.iconBtn}
            edge="end"
            aria-label="edit"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box order={2} ml={3}>
          <IconButton
            onClick={() => deleteHandler(selectedPatient)}
            className={classes.iconBtn}
            edge="end"
            aria-label="delete"
          >
            <DeleteIcon fontSize="small" className={classes.deleteIcon} />
          </IconButton>
        </Box>
      </Box>
    </Fragment>
  );
};

export default GridAction;
