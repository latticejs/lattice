import React from 'react';
import { observer, inject } from 'mobx-react';
import { compose, withHandlers } from 'recompose';
import { Widget } from '@latticejs/widgets';
import { List, ListItem } from '@latticejs/infinite-list';
import { withStyles, Grid, ListItemText } from '@material-ui/core';
import StoreComponent from '../StoreComponent';
import ProjectItem from './Item';
import ListActions from '../List/ListActions';
import Title from '../List/Title';

const sortItems = ['Name', 'Author', { Status: 'active' }];

class ProjectList extends StoreComponent {
  render() {
    const {
      loadMore,
      findItem,
      classes,
      uiStore,
      onEditProject,
      onAddProject,
      selectAllOnSelectAll,
      selectAllOnUnselectAll,
      selectionOnDelete,
      selectionOnActivate,
      sortOrderOnChange,
      sortPropertyOnChange,
      filterOnChange
    } = this.props;

    return (
      <Widget
        title={() => <Title title={`Projects (${this.props.uiStore.projectList.list.length})`} />}
        border="bottom"
        classes={{ root: classes.containerRoot }}
      >
        <Grid container direction="column" justify="center" alignItems="stretch">
          <ListActions
            addButtonTitle={'Add Project'}
            onAdd={onAddProject}
            selectAllDisabled={uiStore.projectList.list.length === 0}
            selectAllOnSelectAll={selectAllOnSelectAll}
            selectAllOnUnselectAll={selectAllOnUnselectAll}
            selectAllChecked={uiStore.projectList.allChecked}
            selectedItems={uiStore.projectList.checked.size}
            selectionOnDelete={selectionOnDelete}
            selectionOnActivate={() => selectionOnActivate(true)}
            selectionOnDeactivate={() => selectionOnActivate(false)}
            sortProperty={uiStore.projectList.sortProperty}
            sortItems={sortItems}
            sortOrder={uiStore.projectList.sortOrder}
            sortOrderOnChange={sortOrderOnChange}
            sortPropertyOnChange={sortPropertyOnChange}
            filterOnChange={filterOnChange}
            filterValue={uiStore.projectList.filterQuery}
          />

          <Grid item xs>
            <List
              loadMore={loadMore}
              findItem={findItem}
              list={uiStore.projectList.list}
              rowCount={uiStore.projectList.list.length}
              rowHeight={55}
              classes={{ root: classes.listRoot }}
            >
              {({ item, isEmpty, key, style }) => {
                if (isEmpty) {
                  return <h4>No projects to show</h4>;
                }

                if (!item) {
                  return (
                    <ListItem key={key} style={style}>
                      <ListItemText primary="loading..." />
                    </ListItem>
                  );
                }

                return <ProjectItem project={item} key={item.id} style={style} onEdit={onEditProject} />;
              }}
            </List>
          </Grid>
        </Grid>
      </Widget>
    );
  }
}

const styles = () => ({
  containerRoot: {
    flex: 1,
    height: '100%'
  },
  listRoot: {
    flex: 1,
    height: '100%'
  }
});

export default compose(
  withStyles(styles),
  inject('projectStore', 'uiStore'),
  withHandlers({
    findItem: ({ uiStore }) => ({ index }) => {
      const projects = uiStore.projectList.list;
      return projects.get(Array.from(projects.keys())[index]);
    },

    loadMore: ({ uiStore }) => async () => {
      return uiStore.projectList.list;
    },
    selectedIds: ({ uiStore }) => () => Array.from(uiStore.projectList.checked.keys())
  }),
  withHandlers({
    selectAllOnSelectAll: ({ uiStore }) => () => {
      uiStore.projectList.selectAll();
    },
    selectAllOnUnselectAll: ({ uiStore }) => () => {
      uiStore.projectList.unselectAll();
    },
    selectionOnDelete: ({ uiStore, projectStore, selectedIds }) => () => {
      selectedIds().forEach(id => {
        projectStore.remove(id);
        uiStore.projectList.setChecked(id, false);
      });
    },
    selectionOnActivate: ({ projectStore, selectedIds }) => (active = true) => {
      selectedIds().forEach(id => {
        projectStore.setActive(id, active);
      });
    },
    sortOrderOnChange: ({ uiStore }) => e => {
      uiStore.projectList.sortOrder = e.target.value;
    },
    sortPropertyOnChange: ({ uiStore }) => e => {
      uiStore.projectList.sortProperty = e.target.value;
    },
    filterOnChange: ({ uiStore }) => e => {
      uiStore.projectList.filterQuery = e.target.value;
    }
  }),
  observer
)(ProjectList);
