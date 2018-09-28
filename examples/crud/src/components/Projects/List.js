import React from 'react';
import { Widget } from '@latticejs/widgets';
import { observer, inject } from 'mobx-react';
import { List, ListItem } from '@latticejs/infinite-list';
import ListItemText from '@material-ui/core/ListItemText';
import StoreComponent from '../StoreComponent';
import { withStyles } from '@material-ui/core';
import ProjectItem from './Item';
import { compose } from 'recompose';

class ProjectsList extends StoreComponent {
  findItem = ({ index }) => {
    const projects = this.props.projectStore.projects;
    return projects.get(Array.from(projects.keys())[index]);
  };

  loadMore = async () => {
    return this.props.projectStore.projects;
  };

  render() {
    const { classes, projectStore, onEditProject } = this.props;
    return (
      <Widget title={'Projects'} border="bottom" classes={{ root: classes.containerRoot }}>
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
    flex: 1
  }
});

export default compose(
  withStyles(styles),
  inject('projectStore', 'uiStore'),
  observer
)(ProjectsList);
