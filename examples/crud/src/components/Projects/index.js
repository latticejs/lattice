import React from 'react';
import { observer, inject } from 'mobx-react';
import ProjectList from './List';
import ProjectForm from './Form';
import { compose, withHandlers, withState } from 'recompose';
import { Grid } from '@material-ui/core';
import { Success } from '../Notification';
import Modal from '../Modal';

const enhance = compose(
  inject('uiStore'),
  withState('saved', 'setSaved', false),
  withHandlers({
    editProject: ({ uiStore }) => project => {
      uiStore.projectForm.setType('edit');
      uiStore.projectForm.setProject(project);
      uiStore.projectForm.setVisible(true);
    },
    cancel: ({ uiStore }) => () => {
      uiStore.projectForm.reset();
    }
  }),
  withHandlers({
    onSave: ({ setSaved, cancel }) => () => {
      setSaved(true);
      cancel();
      setTimeout(() => {
        setSaved(false);
      }, 3000);
    }
  }),
  observer
);

export default enhance(({ uiStore, editProject, cancel, saved, onSave }) => {
  return (
    <Grid container direction="row" justify="center" alignItems="stretch" spacing={16}>
      <Grid item xs>
        <ProjectList onEditProject={editProject} />
      </Grid>

      <Modal open={uiStore.projectForm.visible} onClose={cancel}>
        <ProjectForm onCancel={cancel} onSave={onSave} />
      </Modal>

      <Success open={saved} message="Project saved!" />
    </Grid>
  );
});
