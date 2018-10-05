import { RootStore } from '../utils';
import { observable, decorate, action, computed, autorun } from 'mobx';

const sortValues = (a, b) => ({
  gt: a > b,
  lt: a < b
});

const sortList = (property, order = 'asc') => (a, b) => {
  const noSorted = order === 'asc' ? sortValues(a[property], b[property]) : sortValues(b[property], a[property]);

  return noSorted.gt ? 1 : noSorted.lt ? -1 : 0;
};

export class ProjectList extends RootStore {
  visibleRows = 50;
  checked = observable.map();
  list = [];
  sortProperty = 'name';
  sortOrder = 'asc';
  filterQuery = '';

  constructor(rootStore) {
    super(rootStore);

    autorun(() => {
      this.updateList({
        sortProperty: this.sortProperty,
        sortOrder: this.sortOrder,
        filterQuery: this.filterQuery,
        projects: this.rootStore.projectStore.projects
      });
    });
  }

  get allChecked() {
    return this.list.length > 0 && this.list.length === this.checked.size;
  }

  setChecked(projectIds, checked = true) {
    const ids = Array.isArray(projectIds) ? projectIds : [projectIds];

    ids.forEach(id => (checked ? this.checked.set(id, true) : this.checked.delete(id)));
  }

  isChecked(projectId) {
    return this.checked.has(projectId);
  }

  selectAll() {
    this.setChecked(this.list);
  }

  unselectAll() {
    this.checked.clear();
  }

  updateList({ sortProperty, sortOrder, filterQuery, projects }) {
    const sortFn = sortList(sortProperty, sortOrder);
    let list = Array.from(projects.values());

    if (filterQuery.trim()) {
      const cleanedFilter = filterQuery.replace(/[^a-zA-Z0-9-]/gi, '|');
      const filterReg = new RegExp(`^.*(${cleanedFilter}).*$`, 'gi');
      list = list.filter(p => filterReg.test([p.name, p.author].join()));
    }

    this.list = list.sort(sortFn).map(p => p.id);
  }
}

decorate(ProjectList, {
  allChecked: computed,
  checked: observable,
  filterQuery: observable,
  list: observable,
  selectAll: action,
  setChecked: action,
  setFilter: action,
  setSortOrder: action,
  setSortProperty: action,
  sortOrder: observable,
  sortProperty: observable,
  visibleRows: observable
});
