export class RootStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  getRoot() {
    return this.rootStore;
  }
}
