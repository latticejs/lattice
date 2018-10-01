import { decorate, observable, action, computed } from 'mobx';
import { Project } from './project';
import { RootStore } from './utils';

export class ProjectsList extends RootStore {
  visibleRows = 50;
  checked = observable.map();

  get allChecked() {
    const projectIds = Array.from(this.rootStore.projectStore.projects.keys());
    return projectIds.length === this.checked.size;
  }

  setChecked(projectIds, checked = true) {
    const ids = Array.isArray(projectIds) ? projectIds : [projectIds];

    ids.forEach(id => (checked ? this.checked.set(id, true) : this.checked.delete(id)));
  }

  isChecked(projectId) {
    return this.checked.has(projectId);
  }

  selectAll() {
    const projectIds = Array.from(this.rootStore.projectStore.projects.keys());
    this.setChecked(projectIds);
  }

  unselectAll() {
    this.checked.clear();
  }
}

decorate(ProjectsList, {
  visibleRows: observable,
  checked: observable,
  setChecked: action,
  allChecked: computed,
  selectAll: action
});

export class ProjectForm {
  visible = false;
  type = 'create';
  project;

  setVisible(visible) {
    this.visible = visible;
  }

  setType(type) {
    this.type = type;
  }

  setProject(project) {
    this.project = project;
  }

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
  project: observable,
  setVisible: action,
  setType: action,
  setProject: action
});

export class UiStore extends RootStore {
  projectsList = new ProjectsList(this.rootStore);
  projectForm = new ProjectForm();
}

decorate(UiStore, {
  projectsList: observable,
  projectForm: observable
});
