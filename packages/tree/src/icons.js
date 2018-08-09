import React from 'react';
import FolderClosedIcon from '@material-ui/icons/Folder';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import FileIcon from '@material-ui/icons/InsertDriveFile';

export const FolderClosed = () => <FolderClosedIcon />;

export const FolderOpen = () => <FolderOpenIcon />;

export const File = () => <FileIcon />;

export const withTreeItemIcon = (treeItemIconFn = () => null) => {
  return props => {
    const icon = treeItemIconFn(props);
    if (!icon) return TreeItemIcon(props);
    return icon;
  };
};

export const TreeItemIcon = ({ item, isChild, expanded }) => {
  if (!item.children) return <File />;
  if (item.children && expanded) return <FolderOpen />;
  return <FolderClosed />;
};
