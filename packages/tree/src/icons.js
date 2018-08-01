import React from 'react';
import classNames from 'classnames';
import FolderClosedIcon from '@material-ui/icons/Folder';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';

export const Hierarchy = props => <div className={classNames(props.style)} />;

export const Line = props => <div className={classNames(props.style)} />;

export const TopLevel = props => <div className={classNames(props.style)} />;

export const FolderClosed = () => <FolderClosedIcon />;

export const FolderOpen = () => <FolderOpenIcon />;

export const TreeIcon = ({ item, style, isChild, topIcon, lvl }) => {
  console.log('---');
  console.log('lvl', lvl);
  console.log('isChild', isChild);
  console.log('topIcon', topIcon);
  console.log('item', item);
  console.log('---');
  if (topIcon && lvl === 1) return '';
  if (topIcon && lvl > 1 && !item.label && isChild) return <Line style={style.lineIcon} />;
  if ((topIcon && lvl <= 1) || !item.label) return <TopLevel style={style.topIcon} />;
  if (!topIcon && lvl === 1) return <TopLevel style={style.topIcon} />;

  if (isChild || (!isChild && item.children)) return <Hierarchy style={style.hierarchyIcon} />;

  if (item.children) {
    if (item.expanded) return <FolderOpen />;
    return <FolderClosed />;
  }
  return '';
};
