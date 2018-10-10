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
  withState('showSuccess', 'setShowSuccess', false),
  withHandlers({
    editProject: ({ uiStore, setShowSuccess }) => projectId => {
      uiStore.projectForm.type = 'edit';
      uiStore.projectForm.projectId = projectId;
      uiStore.projectForm.visible = true;
      setShowSuccess(false);
    },
    addProject: ({ uiStore, setShowSuccess }) => () => {
      uiStore.projectForm.reset();
      uiStore.projectForm.visible = true;
      setShowSuccess(false);
    },
    closeModal: ({ uiStore }) => () => {
      uiStore.projectForm.reset();
    }
  }),
  withHandlers({
    onSave: ({ setShowSuccess, closeModal }) => () => {
      setShowSuccess(true);
      closeModal();
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  }),
  observer
);

export default enhance(({ uiStore, editProject, addProject, closeModal, showSuccess, onSave, setShowSuccess }) => {
  return (
    <Grid container direction="column" justify="center" alignItems="stretch" spacing={16}>
      <Grid item xs>
        <ProjectList onEditProject={editProject} onAddProject={addProject} />
      </Grid>

      <Modal open={uiStore.projectForm.visible} onClose={closeModal}>
        <ProjectForm onCancel={closeModal} onSave={onSave} />
      </Modal>

      <Success open={showSuccess} message="Project saved!" onClose={() => setShowSuccess(false)} />
    </Grid>
  );
});
