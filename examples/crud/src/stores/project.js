import { decorate, observable, action, computed, toJS } from 'mobx';
import { RootStore } from './utils';

export class Project {
  id;
  name;
  author;
  active = true;
  createdAt = new Date();
  updatedAt = new Date();

  constructor(data = {}) {
    this.update(data);
  }

  toggleActive() {
    this.setActive(!this.active);
  }

  setActive(active = true) {
    this.active = active;
  }

  update(data) {
    if (!Object.keys(data).length) {
      return;
    }

    for (const key in data) {
      if (data.hasOwnProperty(key) && ['id', 'name', 'author', 'active'].includes(key)) {
        this[key] = data[key];
      }
    }
    this.updatedAt = new Date();
  }

  get toJS() {
    return toJS(this);
  }
}

decorate(Project, {
  name: observable,
  author: observable,
  active: observable,
  toggleActive: action,
  toJS: computed
});

export class ProjectStore extends RootStore {
  projects = observable.map();

  get asList() {
    return Array.from(this.projects.values());
  }

  asSortedList(sortFn) {
    return [...this.asList].sort(sortFn);
  }

  add(projectData) {
    const project = new Project(projectData);
    this.projects.set(project.id, project);
  }

  update(projectId, projectData) {
    const project = this.projects.get(projectId);
    project.update(projectData);
  }

  remove(projectId) {
    const ids = Array.isArray(projectId) ? projectId : [projectId];

    ids.forEach(id => {
      if (!this.projects.has(id)) return;

      this.projects.delete(id);
      this.rootStore.uiStore.projectList.setChecked(id, false);
    });
  }

  setActive(projectId, active = true) {
    this.projects.get(projectId).setActive(active);
  }

  toggleActive(projectId) {
    this.projects.get(projectId).toggleActive();
  }
}

decorate(ProjectStore, {
  add: action,
  asList: computed,
  asSortedList: action,
  projects: observable,
  remove: action,
  setActive: action,
  toggleActive: action
});
