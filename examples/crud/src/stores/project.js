import { decorate, observable, action, computed, toJS } from 'mobx';
import faker from 'faker';

export class Project {
  id = faker.random.uuid();
  name;
  author;
  active = true;
  createdAt = new Date();
  updatedAt = new Date();

  constructor({ id, name, author, active }) {
    this.id = id;
    this.name = name;
    this.author = author;
    this.active = active;
  }

  toggleActive() {
    this.active = !this.active;
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

export class ProjectStore {
  projects = observable.map();

  get asList() {
    return Array.from(this.projects.values());
  }

  add(projectData) {
    const project = new Project(projectData);
    this.projects.set(project.id, project);
  }

  update(id, projectData) {
    const project = this.projects.get(id);
    this.projects.set(id, { ...project, ...projectData });
  }

  remove(projectId) {
    if (!this.projects.has(projectId)) return;

    this.projects.delete(projectId);
  }
}

decorate(ProjectStore, {
  projects: observable,
  add: action,
  remove: action,
  asList: computed
});
