import React from 'react';
import { default as MuiList } from '@material-ui/core/List';
import { default as MuiListItem } from '@material-ui/core/ListItem';
import { default as MuiListItemSecondaryAction } from '@material-ui/core/ListItemSecondaryAction';
import ScrollLoader from './ScrollLoader';

const withDiv = WrappedComponent => props => <WrappedComponent {...props} component="div" />;

export const List = (props = {}) => {
  const { classes, className, dense, disablePadding, subheader, ...loaderProps } = props;

  return (
    <MuiList
      classes={classes}
      className={className}
      dense={dense}
      disablePadding={disablePadding}
      subheader={subheader}
      component="div"
    >
      <ScrollLoader {...loaderProps} />
    </MuiList>
  );
};

export const ListItem = withDiv(MuiListItem);
export const ListItemSecondaryAction = withDiv(MuiListItemSecondaryAction);
