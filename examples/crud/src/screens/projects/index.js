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
    editProject: ({ uiStore, setSaved }) => projectId => {
      uiStore.projectForm.type = 'edit';
      uiStore.projectForm.projectId = projectId;
      uiStore.projectForm.visible = true;
      setSaved(false);
    },
    addProject: ({ uiStore, setSaved }) => () => {
      uiStore.projectForm.reset();
      uiStore.projectForm.visible = true;
      setSaved(false);
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

export default enhance(({ uiStore, editProject, addProject, close, saved, onSave, setSaved }) => {
  return (
    <Grid container direction="column" justify="center" alignItems="stretch" spacing={16}>
      <Grid item xs>
        <ProjectList onEditProject={editProject} onAddProject={addProject} />
      </Grid>

      <Modal open={uiStore.projectForm.visible} onClose={close}>
        <ProjectForm onCancel={close} onSave={onSave} />
      </Modal>

      <Success open={saved} message="Project saved!" onClose={() => setSaved(false)} />
    </Grid>
  );
});
