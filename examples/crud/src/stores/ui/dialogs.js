import { observable, decorate, action } from 'mobx';
import { RootStore } from '../utils';
import { ConfirmationDialog } from '../../components/Dialog';
import faker from 'faker';

class Dialog {
  id = faker.random.uuid();
  title;
  content;

  constructor({ title, content }) {
    this.title = title;
    this.content = content;
  }

  get renderProps() {
    return {
      title: this.title,
      content: this.content
    };
  }
}

decorate(Dialog, {
  title: observable,
  content: observable
});

export class ConfirmDialog extends Dialog {
  component = ConfirmationDialog;
  onAccept = () => {};
  onCancel = () => {};
  onClose = () => {};

  constructor({ onAccept, onCancel, onClose, ...dialogProps }) {
    super(dialogProps);

    this.onAccept = onAccept;
    this.onCancel = onCancel;
    this.onClose = onClose;
  }

  get renderProps() {
    return {
      ...super.renderProps,
      onAccept: this.onAccept,
      onCancel: this.onCancel,
      onClose: this.onClose
    };
  }
}

export class Dialogs extends RootStore {
  stack = [];

  showConfirm(options) {
    this.stack.push(new ConfirmDialog(options));
  }

  close(id) {
    const index = this.stack.findIndex(dialog => dialog.id === id);
    this.stack.splice(index, 1);
  }
}

decorate(Dialogs, {
  stack: observable,
  close: action
});
