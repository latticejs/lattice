import React from 'react';
import Collapse from '@material-ui/core/Collapse';

import { Item, Childrens } from './child';

const Parent = props => {
  const { item, lvl, childClass = {}, childrens, isExpanded } = props;

  return (
    <React.Fragment>
      <Item key={`${item.label}-${lvl}`} {...props} />
      <Collapse in={isExpanded(item)} timeout="auto" unmountOnExit>
        {Childrens({ childrens, childClass })}
      </Collapse>
    </React.Fragment>
  );
};

export default Parent;
