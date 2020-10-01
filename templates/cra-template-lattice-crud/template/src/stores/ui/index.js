import { decorate, observable } from 'mobx';
import { ProjectList } from './project-list';
import { ProjectForm } from './project-form';
import { RootStore } from '../utils';
import { Dialogs } from './dialogs';

export class UiStore extends RootStore {
  projectList = new ProjectList(this.rootStore);
  projectForm = new ProjectForm(this.rootStore);
  dialogs = new Dialogs(this.rootStore);
}

decorate(UiStore, {
  projectList: observable,
  projectForm: observable,
  dialogs: observable,
});
