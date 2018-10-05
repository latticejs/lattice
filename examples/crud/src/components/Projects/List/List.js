import React from 'react';
import { observer, inject } from 'mobx-react';
import { compose, withHandlers } from 'recompose';
import { List as InfiniteList, ListItem } from '@latticejs/infinite-list';
import { withStyles, ListItemText } from '@material-ui/core';
import ProjectItem from './Item';

const List = props => {
  const { loadMore, findItem, classes, uiStore, onEditProject } = props;

  return (
    <InfiniteList
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

        return <ProjectItem projectId={item} key={item} style={style} onEdit={onEditProject} />;
      }}
    </InfiniteList>
  );
};

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
      console.log('findItem');
      return uiStore.projectList.list[index];
    },

    loadMore: ({ uiStore, setStartIndex, setStopIndex }) => async ({ startIndex, stopIndex }) => {
      return uiStore.projectList.list.slice(startIndex, stopIndex);
    }
  }),
  observer
)(List);
