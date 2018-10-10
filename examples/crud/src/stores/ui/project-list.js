import { RootStore } from '../utils';
import { observable, decorate, action, computed } from 'mobx';

const sortValues = (a, b) => ({
  gt: a > b,
  lt: a < b
});

const sortList = (property, order = 'asc') => (a, b) => {
  const noSorted = order === 'asc' ? sortValues(a[property], b[property]) : sortValues(b[property], a[property]);

  return noSorted.gt ? 1 : noSorted.lt ? -1 : 0;
};

const VISIBLE_ROWS = 20;

export class ProjectList extends RootStore {
  visibleRows = VISIBLE_ROWS;
  availableItems = 0;
  checked = observable.map();
  sortProperty = 'name';
  sortOrder = 'asc';
  filterQuery = '';

  getItem(index) {
    if (index < this.availableItems) {
      return this.list[index];
    }

    return null;
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

  get list() {
    const sortFn = sortList(this.sortProperty, this.sortOrder);
    let list = Array.from(this.rootStore.projectStore.projects.values());

    if (this.filterQuery.trim()) {
      const cleanedFilter = this.filterQuery.replace(/[^a-zA-Z0-9-]/gi, '|');
      const filterReg = new RegExp(`.*(${cleanedFilter}).*`, 'gi');
      list = list.filter(p => filterReg.test(p.name) || filterReg.test(p.author));
    }

    return list.sort(sortFn).map(p => p.id);
  }
}

decorate(ProjectList, {
  allChecked: computed,
  checked: observable,
  filterQuery: observable,
  list: computed,
  selectAll: action,
  setChecked: action,
  setFilter: action,
  setSortOrder: action,
  setSortProperty: action,
  sortOrder: observable,
  sortProperty: observable,
  visibleRows: observable,
  availableItems: observable
});
