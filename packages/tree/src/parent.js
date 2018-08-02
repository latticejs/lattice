import React from 'react';
import { ChildLabel, ChildChildren } from './child';

const Parent = props => {
  const { childClass = {}, item, childrens, isChild, lvl, iconFn } = props;

  return (
    <React.Fragment>
      {ChildLabel({ item, childClass, isChild, lvl, iconFn })}
      {ChildChildren({ childrens, childClass })}
    </React.Fragment>
  );
};

export default Parent;
