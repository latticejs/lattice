import React, { Component } from 'react';
import classNames from 'classnames';
// \ Material-UI \
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

//export const ChildLabel = props => {
export class Item extends Component {
  getKey() {
    const { item, lvl } = this.props;
    return `lattice-tree-${item.label}-${lvl}`;
  }

  cascadeCheckAll = ({ initial, item, checked, lvl, key = '' }) => {
    if (item.children) {
      initial.items.push(item);
      initial.keys.push(`lattice-tree-${item.label}-${lvl}`);
      lvl = lvl + 1;
      return item.children.reduce((initial, subItem, idx) => {
        return {
          ...initial,
          ...this.cascadeCheckAll({
            initial,
            item: subItem,
            checked,
            key: `lattice-tree-${subItem.label}-${lvl}`,
            lvl
          })
        };
      }, initial);
    } else {
      // onCheckItem({ checked, item, key });
      initial.items.push(item);
      initial.keys.push(key);
      return initial;
    }
  };

  handleOnCheckItem = ({ e, checked, item, cascadeCheck, onCheckItem, lvl }) => {
    e.stopPropagation();
    if (item.children && cascadeCheck) {
      const initial = { items: [], keys: [] };
      const checkedItems = this.cascadeCheckAll({ initial, item, checked, lvl, onCheckItem });
      return onCheckItem({ checked, items: checkedItems.items, keys: checkedItems.keys });
    }
    return onCheckItem({ checked, items: [item], keys: [this.getKey()] });
  };

  handleToggleFold = ({ e, item, toggleFold }) => {
    if (typeof e.target.checked !== 'undefined') return false;
    if (!item.children) return;
    toggleFold(item);
  };

  render() {
    const {
      item = {},
      isChild = false,
      iconItem,
      isExpanded,
      isChecked,
      cascadeCheck,
      onCheckItem,
      toggleFold,
      lvl
    } = this.props;

    return (
      <ListItem
        key={this.getKey()}
        button
        onClick={e => this.handleToggleFold({ e, item, toggleFold })}
        component="div"
      >
        <ListItemIcon>{iconItem({ item, isChild, expanded: isExpanded(item) })}</ListItemIcon>
        <Checkbox
          checked={isChecked(this.getKey())}
          onChange={(e, checked) => this.handleOnCheckItem({ e, checked, item, cascadeCheck, onCheckItem, lvl })}
          tabIndex={-1}
          disableRipple
        />
        <ListItemText primary={item.label} />
      </ListItem>
    );
  }
}

export const Childrens = props => {
  const { childClass = {}, childrens } = props;

  return (
    <List component="div" disablePadding className={classNames(childClass.treeItemNested)}>
      {childrens}
    </List>
  );
};
