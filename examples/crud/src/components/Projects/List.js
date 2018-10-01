import React from 'react';
import { observer, inject } from 'mobx-react';
import { compose, withHandlers } from 'recompose';
import { Widget } from '@latticejs/widgets';
import { List, ListItem } from '@latticejs/infinite-list';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles, Typography, Grid } from '@material-ui/core';
import StoreComponent from '../StoreComponent';
import ProjectItem from './Item';
import SelectAllButton from '../List/SelectAllButton';
import AddButton from '../List/AddButton';

const enhanceListActions = compose(
  withHandlers({
    onChange: ({ selectAllOnSelectAll, selectAllOnUnselectAll }) => (e, checked) =>
      checked ? selectAllOnSelectAll() : selectAllOnUnselectAll()
  })
);

const ListActions = enhanceListActions(({ onAdd, onChange, selectAllChecked }) => {
  return (
    <Grid item container direction="row" justify="flex-start" alignItems="center">
      <Grid item xs>
        <SelectAllButton onChange={onChange} checked={selectAllChecked} />
      </Grid>
      <Grid item>
        <AddButton onClick={onAdd}>Add project</AddButton>
      </Grid>
    </Grid>
  );
});

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
    const { classes, projectStore, uiStore, onEditProject, onAddProject } = this.props;
    return (
      <Widget title={this.renderTitle} border="bottom" classes={{ root: classes.containerRoot }}>
        <Grid container direction="column" justify="center" alignItems="stretch">
          <ListActions
            onAdd={onAddProject}
            selectAllOnSelectAll={() => uiStore.projectsList.selectAll()}
            selectAllOnUnselectAll={() => uiStore.projectsList.unselectAll()}
            selectAllChecked={uiStore.projectsList.allChecked}
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
  observer
)(ProjectsList);
