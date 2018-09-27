import { ProjectStore } from './project';
import { UiStore } from './ui';

export class AppStore {
  projectStore;
  uiStore;

  constructor({ projectStore, uiStore }) {
    this.projectStore = projectStore;
    this.uiStore = uiStore;
  }

  injectableStores() {
    return {
      store: this,
      projectStore: this.projectStore,
      uiStore: this.uiStore
    };
  }
}

export default () =>
  new AppStore({
    projectStore: new ProjectStore(),
    uiStore: new UiStore()
  });
