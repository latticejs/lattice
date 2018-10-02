import { decorate, observable, action, computed, toJS } from 'mobx';
import { RootStore } from './utils';
// import faker from 'faker';

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
    if (!this.projects.has(projectId)) return;

    this.projects.delete(projectId);
  }

  setActive(projectId, active = true) {
    this.projects.get(projectId).setActive(active);
  }
}

decorate(ProjectStore, {
  projects: observable,
  add: action,
  remove: action,
  asList: computed,
  asSortedList: action
});
