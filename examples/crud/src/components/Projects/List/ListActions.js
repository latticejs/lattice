import React from 'react';
import { observer, inject } from 'mobx-react';
import { compose, withHandlers, withState } from 'recompose';
import Debounced from '../../../lib/debounce';
import ListActions from '../../List/ListActions';

const sortItems = ['Name', 'Author', { Status: 'active' }];

const ProjectListActions = props => {
  const {
    uiStore: { projectList },
    onAddProject,
    selectAllOnSelectAll,
    selectAllOnUnselectAll,
    selectionOnDelete,
    selectionOnActivate,
    sortOrderOnChange,
    sortPropertyOnChange,
    filterOnChange
  } = props;

  return (
    <ListActions
      addButtonTitle={'Add Project'}
      onAdd={onAddProject}
      selectAllDisabled={projectList.list.length === 0}
      selectAllOnSelectAll={selectAllOnSelectAll}
      selectAllOnUnselectAll={selectAllOnUnselectAll}
      selectAllChecked={projectList.allChecked}
      selectedItems={projectList.checked.size}
      selectionOnDelete={selectionOnDelete}
      selectionOnActivate={() => selectionOnActivate(true)}
      selectionOnDeactivate={() => selectionOnActivate(false)}
      sortProperty={projectList.sortProperty}
      sortItems={sortItems}
      sortOrder={projectList.sortOrder}
      sortOrderOnChange={sortOrderOnChange}
      sortPropertyOnChange={sortPropertyOnChange}
      filterOnChange={filterOnChange}
    />
  );
};

export default compose(
  inject('projectStore', 'uiStore'),
  withState('filterDebounce', 'setFilterDebounce', new Debounced(500)),
  withHandlers({
    selectedIds: ({ uiStore: { projectList } }) => () => Array.from(projectList.checked.keys())
  }),
  withHandlers({
    selectAllOnSelectAll: ({ uiStore: { projectList } }) => () => {
      projectList.selectAll();
    },
    selectAllOnUnselectAll: ({ uiStore: { projectList } }) => () => {
      projectList.unselectAll();
    },
    selectionOnDelete: ({ uiStore: { projectList, dialogs }, projectStore, selectedIds }) => () => {
      dialogs.showConfirm({
        content: (
          <div>
            Are you sure to delete{' '}
            <b>
              {selectedIds().length} project
              {selectedIds().length > 1 && 's'}
            </b>
            ?
          </div>
        ),
        onAccept: () => {
          selectedIds().forEach(id => {
            projectStore.remove(id);
            projectList.setChecked(id, false);
          });
        }
      });
    },
    selectionOnActivate: ({ projectStore, selectedIds }) => (active = true) => {
      selectedIds().forEach(id => {
        projectStore.setActive(id, active);
      });
    },
    sortOrderOnChange: ({ uiStore: { projectList } }) => e => {
      projectList.sortOrder = e.target.value;
    },
    sortPropertyOnChange: ({ uiStore: { projectList } }) => e => {
      projectList.sortProperty = e.target.value;
    },
    filterOnChange: ({ uiStore: { projectList }, filterDebounce }) => e => {
      const value = e.target.value;
      filterDebounce.run(() => {
        projectList.filterQuery = value;
      });
    }
  }),
  observer
)(ProjectListActions);
