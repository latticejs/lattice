import React from 'react';
import { observer, inject } from 'mobx-react';
import Types from 'prop-types';
import { ListItem, ListItemSecondaryAction } from '@latticejs/infinite-list';
import { ListItemText, Checkbox, Switch, IconButton, Tooltip } from '@material-ui/core';
import { compose, withHandlers } from 'recompose';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

const enhance = compose(
  // withStyles(ListItemStyles),
  inject('uiStore', 'projectStore'),
  withHandlers({
    toggleChecked: ({
      uiStore: {
        projectsList: { checked }
      },
      project
    }) => () => {
      if (checked.has(project.id)) {
        return checked.delete(project.id);
      }
      checked.set(project.id, true);
    },
    toggleActive: ({ project }) => e => {
      e.stopPropagation();
      project.toggleActive();
    },
    remove: ({ projectStore, project }) => () => {
      return projectStore.remove(project.id);
    },
    edit: ({ onEdit, project }) => e => {
      e.preventDefault();
      e.stopPropagation();
      onEdit(project);
    }
  }),
  observer
);

const RemoveIcon = ({ onClick }) => (
  <Tooltip title="Delete">
    <IconButton aria-label="Delete" onClick={onClick}>
      <DeleteIcon />
    </IconButton>
  </Tooltip>
);

const ToggleActiveIcon = ({ checked, onClick }) => {
  return (
    <Tooltip title={`${checked ? 'Deactivate' : 'Activate'}`}>
      <Switch onClick={onClick} checked={checked} />
    </Tooltip>
  );
};

const ShowEditIcon = ({ onClick }) => (
  <Tooltip title="Edit">
    <IconButton aria-label="Edit" onClick={onClick}>
      <EditIcon />
    </IconButton>
  </Tooltip>
);

RemoveIcon.propTypes = ShowEditIcon.propTypes = {
  onClick: Types.func
};

ToggleActiveIcon.propTypes = {
  onClick: Types.func,
  checked: Types.bool
};

export default enhance(({ project, uiStore, toggleChecked, toggleActive, remove, edit, style, classes }) => {
  const isChecked = uiStore.projectsList.checked.has(project.id);

  return (
    <ListItem button onClick={toggleChecked} selected={isChecked} style={style} classes={classes}>
      <Checkbox checked={uiStore.projectsList.checked.has(project.id)} tabIndex={-1} disableRipple />

      <ListItemText primary={project.name} secondary={project.author} />

      <ListItemSecondaryAction>
        <ShowEditIcon onClick={edit} />
        <RemoveIcon onClick={remove} />
        <ToggleActiveIcon onClick={toggleActive} checked={project.active} />
      </ListItemSecondaryAction>
    </ListItem>
  );
});

// const ListItemStyles = () => ({});
