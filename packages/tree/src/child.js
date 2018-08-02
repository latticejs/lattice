import React from 'react';
import classNames from 'classnames';

export const ChildLabel = props => {
  const { childClass = {}, item = {}, isChild = false, lvl, iconFn } = props;
  return (
    <div className={classNames(childClass.child)}>
      {Array.from({ length: lvl }, (v, idx) => (
        <div className={classNames(childClass.iconContainer)}>
          {iconFn({ item, style: childClass, isChild, lvl, idx })}
        </div>
      ))}
      <div className={classNames(childClass.itemContainer)}>{item.label}</div>
    </div>
  );
};

export const ChildChildren = props => {
  const { childClass = {}, childrens } = props;

  return (
    <div className={classNames(childClass.child)}>
      <div>{childrens}</div>
    </div>
  );
};
