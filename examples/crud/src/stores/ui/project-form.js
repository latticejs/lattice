import { observable, decorate, computed } from 'mobx';
import { Project } from '../project';
import { RootStore } from '../utils';

export class ProjectForm extends RootStore {
  visible = false;
  type = 'create';
  projectId;

  reset() {
    this.visible = false;
    this.type = 'create';
    this.projectId = null;
  }

  get isCreating() {
    return this.type === 'create';
  }

  get project() {
    if (this.projectId) {
      return this.rootStore.projectStore.projects.get(this.projectId);
    }

    return new Project();
  }
}

decorate(ProjectForm, {
  visible: observable,
  type: observable,
  projectId: observable,
  project: computed,
});
