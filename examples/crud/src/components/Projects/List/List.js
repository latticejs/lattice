import React from 'react';
import { observer, inject } from 'mobx-react';
import { compose, withHandlers, withState } from 'recompose';
import { List as InfiniteList, ListItem } from '@latticejs/infinite-list';
import { withStyles, ListItemText } from '@material-ui/core';
import ProjectItem from './Item';

const List = (props) => {
  const { loadMore, findItem, classes, uiStore, onEditProject } = props;
  const { availableItems, list } = uiStore.projectList;

  return (
    <InfiniteList
      loadMore={loadMore}
      findItem={findItem}
      list={list.slice(0, availableItems)}
      rowCount={list.length}
      rowHeight={55}
      classes={{ root: classes.listRoot }}
    >
      {({ item, isEmpty, key, style }) => {
        if (isEmpty) {
          return (
            <ListItem key={key} style={style}>
              <ListItemText primary="No projects to show" />
            </ListItem>
          );
        }

        if (!item) {
          return (
            <ListItem key={key} style={style}>
              <ListItemText primary="loading..." />
            </ListItem>
          );
        }

        return <ProjectItem projectId={item} key={key} style={style} onEdit={onEditProject} />;
      }}
    </InfiniteList>
  );
};

const styles = () => ({
  containerRoot: {
    flex: 1,
    height: '100%',
  },
  listRoot: {
    flex: 1,
    height: '100%',
  },
});

export default compose(
  withStyles(styles),
  inject('projectStore', 'uiStore'),
  withState('loadMoreTO', 'setLoadMoreTO', null),
  withHandlers({
    findItem: ({ uiStore }) => ({ index }) => {
      return uiStore.projectList.getItem(index);
    },

    loadMore: ({ uiStore, loadMoreTO, setLoadMoreTO }) => async ({ stopIndex }) => {
      if (loadMoreTO) {
        clearTimeout(loadMoreTO);
      }

      setLoadMoreTO(
        setTimeout(() => {
          uiStore.projectList.availableItems = Math.max(uiStore.projectList.availableItems, stopIndex + 1);
        }, Math.floor(Math.random() * 1000))
      );
    },
  }),
  observer
)(List);
