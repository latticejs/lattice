import React from 'react';
import classNames from 'classnames';

export const ChildLabel = props => {
  const { childClass = {}, item = {}, isChild = false, topIcon, lvl, iconFn } = props;
  return (
    <div className={classNames(childClass.child)}>
      <div className={classNames(childClass.iconContainer)}>
        {iconFn({ item, style: childClass, isChild, topIcon, lvl })}
      </div>
      <div className={classNames(childClass.itemContainer)}>{item.label}</div>
    </div>
  );
};

export const ChildChildren = props => {
  const { childClass = {}, item = {}, isChild = false, childrens, lvl, topIcon, iconFn } = props;

  return (
    <div className={classNames(childClass.child)}>
      <div className={classNames(childClass.iconContainer)}>
        {iconFn({ item, style: childClass, isChild, topIcon, lvl })}
      </div>
      <div>{childrens}</div>
    </div>
  );
};
