import React from 'react';
import { observer, inject } from 'mobx-react';
import { compose, withHandlers } from 'recompose';
import { Widget } from '@latticejs/widgets';
import { List, ListItem } from '@latticejs/infinite-list';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles, Typography, Grid, Button } from '@material-ui/core';
import StoreComponent from '../StoreComponent';
import ProjectItem from './Item';
import SelectAllButton from '../List/SelectAllButton';
import AddButton from '../List/AddButton';

const SelectionInfo = ({ selected }) => <Typography variant="caption">{selected} selected</Typography>;

const enhanceListActions = compose(
  withHandlers({
    onChange: ({ selectAllOnSelectAll, selectAllOnUnselectAll }) => (e, checked) =>
      checked ? selectAllOnSelectAll() : selectAllOnUnselectAll()
  })
);

const ListActions = enhanceListActions(
  ({
    onAdd,
    onChange,
    selectAllDisabled,
    selectAllChecked,
    selectedItems,
    selectionOnDelete,
    selectionOnActivate,
    selectionOnDeactivate
  }) => {
    return (
      <Grid item container direction="row" justify="flex-start" alignItems="center">
        <Grid item xs container>
          <SelectAllButton onChange={onChange} checked={selectAllChecked} disabled={selectAllDisabled} />

          {selectedItems > 0 && (
            <Grid item xs container alignItems="center" spacing={16}>
              <Grid item xs={1} container justify="center">
                <SelectionInfo selected={selectedItems} />
              </Grid>
              <Grid item>
                <Button variant="outlined" color="secondary" onClick={selectionOnDelete}>
                  Delete
                </Button>
              </Grid>
              <Grid item container spacing={8} xs>
                <Grid item>
                  <Button variant="outlined" color="primary" onClick={selectionOnActivate}>
                    Activate
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" onClick={selectionOnDeactivate}>
                    Deactivate
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
        <Grid item>
          <AddButton onClick={onAdd}>Add project</AddButton>
        </Grid>
      </Grid>
    );
  }
);

class ProjectsList extends StoreComponent {
  findItem = ({ index }) => {
    const projects = this.props.projectStore.projects;
    return projects.get(Array.from(projects.keys())[index]);
  };

  loadMore = async () => {
    return this.props.projectStore.projects;
  };

  renderTitle = () => {
    return (
      <Typography variant="title" color="inherit" gutterBottom>
        Projects ({this.props.projectStore.projects.size})
      </Typography>
    );
  };

  render() {
    const {
      classes,
      projectStore,
      uiStore,
      onEditProject,
      onAddProject,
      selectAllOnSelectAll,
      selectAllOnUnselectAll,
      selectionOnDelete,
      selectionOnActivate
    } = this.props;
    return (
      <Widget title={this.renderTitle} border="bottom" classes={{ root: classes.containerRoot }}>
        <Grid container direction="column" justify="center" alignItems="stretch">
          <ListActions
            onAdd={onAddProject}
            selectAllDisabled={projectStore.projects.size === 0}
            selectAllOnSelectAll={selectAllOnSelectAll}
            selectAllOnUnselectAll={selectAllOnUnselectAll}
            selectAllChecked={uiStore.projectsList.allChecked}
            selectedItems={uiStore.projectsList.checked.size}
            selectionOnDelete={selectionOnDelete}
            selectionOnActivate={() => selectionOnActivate(true)}
            selectionOnDeactivate={() => selectionOnActivate(false)}
          />

          <Grid item xs>
            <List
              loadMore={this.loadMore}
              findItem={this.findItem}
              list={projectStore.asList}
              rowCount={projectStore.projects.size}
              rowHeight={55}
              classes={{ root: classes.listRoot }}
            >
              {({ item, isEmpty, key, style }) => {
                if (isEmpty) {
                  return <h4>Empty list</h4>;
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
    selectedIds: ({ uiStore }) => () => Array.from(uiStore.projectsList.checked.keys())
  }),
  withHandlers({
    selectAllOnSelectAll: ({ uiStore }) => () => {
      uiStore.projectsList.selectAll();
    },
    selectAllOnUnselectAll: ({ uiStore }) => () => {
      uiStore.projectsList.unselectAll();
    },
    selectionOnDelete: ({ uiStore, projectStore, selectedIds }) => () => {
      selectedIds().forEach(id => {
        projectStore.remove(id);
        uiStore.projectsList.setChecked(id, false);
      });
    },
    selectionOnActivate: ({ projectStore, selectedIds }) => (active = true) => {
      selectedIds().forEach(id => {
        projectStore.setActive(id, active);
      });
    }
  }),
  observer
)(ProjectsList);
