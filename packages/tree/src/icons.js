import React from 'react';
import classNames from 'classnames';
import FolderClosedIcon from '@material-ui/icons/Folder';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';

export const Hierarchy = props => <div className={classNames(props.style)} />;

export const Line = props => <div className={classNames(props.style)} />;

export const TopLevel = props => <div className={classNames(props.style)} />;

export const FolderClosed = () => <FolderClosedIcon />;

export const FolderOpen = () => <FolderOpenIcon />;

export const TreeIcon = ({ item, style, isChild, lvl, idx }) => {
  // Note (dk): TreeIcon is a function helper to display the right "structural icon".
  // What is a "structural icon"? It is a icon as a block to create the proper tree
  // structure (with identation/hierarchy levels). It can be a Line (like a pipe) or
  // a Hierarchy wich looks like and "L". It is not the element icon itself.

  // root lvl - no structural icon
  if (lvl === 1) return '';
  // icon is btw root and end of the row (this is the actual child or parent)
  if (lvl > 1 && idx < lvl - 1) return <Line style={style.lineIcon} />;
  // then finally, we apply the actual child/parent icon
  if (item.children || isChild) return <Hierarchy style={style.hierarchyIcon} />;
  return '';
};
