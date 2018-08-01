import React from 'react';
import { ChildLabel, ChildChildren } from './child';

const Parent = props => {
  const { childClass = {}, item, childrens, isChild, lvl, iconFn } = props;

  return (
    <React.Fragment>
      {ChildLabel({ item, childClass, topIcon: true, lvl, iconFn })}
      {ChildChildren({ childrens, childClass, isChild, topIcon: true, lvl, iconFn })}
    </React.Fragment>
  );
};

export default Parent;
