import { decorate, observable, action } from 'mobx';

export class ProjectsList {
  visibleRows = 50;
  checked = observable.map();
}

decorate(ProjectsList, {
  visibleRows: observable,
  checked: observable
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
    this.project = null;
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

export class UiStore {
  projectsList = new ProjectsList();
  projectForm = new ProjectForm();
}

decorate(UiStore, {
  projectsList: observable,
  projectForm: observable
});
