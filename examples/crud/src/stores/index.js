import { ProjectStore } from './project';
import { UiStore } from './ui';

export class AppStore {
  projectStore;
  uiStore;

  constructor() {
    this.projectStore = new ProjectStore(this);
    this.uiStore = new UiStore(this);
  }

  injectableStores() {
    return {
      store: this,
      projectStore: this.projectStore,
      uiStore: this.uiStore
    };
  }
}

export default () => new AppStore();
