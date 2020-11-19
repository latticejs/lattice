import React from 'react';
import Collapse from '@material-ui/core/Collapse';

import { Item, Childrens } from './child';

const Parent = (props) => {
  const { key, item, lvl, childClass = {}, childrens, isExpanded } = props;

  return (
    <React.Fragment key={`parent-${key}`}>
      <Item {...props} />
      <Collapse in={isExpanded({ item, lvl })} timeout="auto" unmountOnExit>
        {Childrens({ childrens, childClass })}
      </Collapse>
    </React.Fragment>
  );
};

export default Parent;
