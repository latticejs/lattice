import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { compose, withHandlers, defaultProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core';

const enhanceConfirmation = compose(
  inject('uiStore'),
  defaultProps({
    title: 'Confirm delete',
    content: 'Are you sure to delete this item?',
    onClose: () => null,
    onAccept: () => null,
    onCancel: () => null,
    acceptText: 'Confirm',
    cancelText: 'Cancel',
  }),
  withHandlers({
    close: ({ uiStore, id, onClose }) => () => {
      onClose();
      uiStore.dialogs.close(id);
    },
  }),
  withHandlers({
    accept: ({ close, onAccept }) => () => {
      onAccept();
      close();
    },
    cancel: ({ close, onCancel }) => () => {
      onCancel();
      close();
    },
  }),
  withStyles((theme) => ({
    paper: {
      borderBottomStyle: 'solid',
      borderBottomColor: theme.palette.primary[theme.palette.type],
      borderBottomWidth: theme.spacing(0.5),
    },
  })),
  observer
);

export const ConfirmationDialog = enhanceConfirmation(
  ({ id, title, content, close, accept, cancel, acceptText, cancelText, classes }) => (
    <Dialog onClose={close} aria-labelledby={id} open={true} classes={classes}>
      <DialogTitle id={id}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancel} color="default" variant="contained" autoFocus>
          {cancelText}
        </Button>
        <Button onClick={accept} color="primary" variant="contained">
          {acceptText}
        </Button>
      </DialogActions>
    </Dialog>
  )
);
