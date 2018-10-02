import { decorate, observable } from 'mobx';
import { ProjectList } from './project-list';
import { ProjectForm } from './project-form';
import { RootStore } from '../utils';

export class UiStore extends RootStore {
  projectList = new ProjectList(this.rootStore);
  projectForm = new ProjectForm();
}

decorate(UiStore, {
  projectList: observable,
  projectForm: observable
});
