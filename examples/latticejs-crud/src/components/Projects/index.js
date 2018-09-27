import React from 'react';
import { observer, inject } from 'mobx-react';
import ProjectList from './List';
import ProjectForm from './Form';
import { compose, withHandlers, withState } from 'recompose';
import { Grid, Modal } from '@material-ui/core';
import { Success } from '../Notification';

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
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={uiStore.projectForm.visible}
        onClose={cancel}
      >
        <div
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            position: 'absolute'
          }}
        >
          <ProjectForm onCancel={cancel} onSave={onSave} />
        </div>
      </Modal>

      <Success open={saved} message="Project saved!" />
    </Grid>
  );
});
