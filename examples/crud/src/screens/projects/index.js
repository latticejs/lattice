import React from 'react';
import { observer, inject } from 'mobx-react';
import ProjectList from '../../components/Projects/List';
import ProjectForm from '../../components/Projects/Form';
import { compose, withHandlers, withState } from 'recompose';
import { Grid } from '@material-ui/core';
import { Success } from '../../components/Notification';
import Modal from '../../components/Modal';

const enhance = compose(
  inject('uiStore'),
  withState('saved', 'setSaved', false),
  withHandlers({
    editProject: ({ uiStore }) => project => {
      uiStore.projectForm.setType('edit');
      uiStore.projectForm.setProject(project);
      uiStore.projectForm.setVisible(true);
    },
    addProject: ({ uiStore }) => () => {
      uiStore.projectForm.reset();
      uiStore.projectForm.setVisible(true);
    },
    close: ({ uiStore }) => () => {
      uiStore.projectForm.reset();
    }
  }),
  withHandlers({
    onSave: ({ setSaved, close }) => () => {
      setSaved(true);
      close();
      setTimeout(() => {
        setSaved(false);
      }, 3000);
    }
  }),
  observer
);

export default enhance(({ uiStore, editProject, addProject, close, saved, onSave }) => {
  return (
    <Grid container direction="column" justify="center" alignItems="stretch" spacing={16}>
      <Grid item xs>
        <ProjectList onEditProject={editProject} onAddProject={addProject} />
      </Grid>

      <Modal open={uiStore.projectForm.visible} onClose={close}>
        <ProjectForm onCancel={close} onSave={onSave} />
      </Modal>

      <Success open={saved} message="Project saved!" />
    </Grid>
  );
});
