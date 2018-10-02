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
      const { sortProperty, sortOrder, filterQuery } = this;
      const list = this.rootStore.projectStore.asList;

      this.updateList({ sortProperty, sortOrder, filterQuery, list });
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
    this.setChecked(this.list.map(p => p.id));
  }

  unselectAll() {
    this.checked.clear();
  }

  updateList({ sortProperty, sortOrder, filterQuery, list }) {
    const sortFn = sortList(sortProperty, sortOrder);

    if (filterQuery.trim()) {
      const cleanedFilter = filterQuery.replace(/[^a-zA-Z0-9-]/gi, '|');
      const filterReg = new RegExp(`^.*(${cleanedFilter}).*$`, 'gi');
      list = list.filter(p => filterReg.test([p.name, p.author].join()));
    }

    this.list = list.sort(sortFn);
  }
}

decorate(ProjectList, {
  list: observable,
  visibleRows: observable,
  checked: observable,
  sortProperty: observable,
  sortOrder: observable,
  filterQuery: observable,
  setChecked: action,
  allChecked: computed,
  selectAll: action,
  setSortOrder: action,
  setSortProperty: action,
  setFilter: action
});
