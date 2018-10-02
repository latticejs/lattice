import { Project } from '../project';
import { observable, decorate } from 'mobx';

export class ProjectForm {
  visible = false;
  type = 'create';
  project;

  reset() {
    this.visible = false;
    this.type = 'create';
    this.project = new Project();
  }

  get isCreating() {
    return this.type === 'create';
  }
}

decorate(ProjectForm, {
  visible: observable,
  type: observable,
  project: observable
});
