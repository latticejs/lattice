import React, { Component } from 'react';
import classNames from 'classnames';
import Types from 'prop-types';
// \ Material-UI \
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

export class Item extends Component {
  cascadeCheckAll = ({ initial, item, checked, lvl, key = '', getItemKey }) => {
    if (item.children) {
      initial.items.push(item);
      initial.keys.push(getItemKey({ item, lvl }));
      lvl = lvl + 1;
      return item.children.reduce((initial, subItem, idx) => {
        return {
          ...initial,
          ...this.cascadeCheckAll({
            initial,
            item: subItem,
            checked,
            key: getItemKey({ item: subItem, lvl }),
            lvl,
            getItemKey
          })
        };
      }, initial);
    } else {
      initial.items.push(item);
      initial.keys.push(key);
      return initial;
    }
  };

  handleOnCheckItem = ({ e, checked, item, cascadeCheck, onCheckItem, lvl, getItemKey }) => {
    e.stopPropagation();
    if (item.children && cascadeCheck) {
      const initial = { items: [], keys: [] };
      const checkedItems = this.cascadeCheckAll({ initial, item, checked, lvl, getItemKey });
      return onCheckItem({ checked, items: checkedItems.items, keys: checkedItems.keys });
    }
    return onCheckItem({ checked, items: [item], keys: [getItemKey({ item, lvl })] });
  };

  handleToggleFold = ({ e, item, toggleFold, lvl }) => {
    if (typeof e.target.checked !== 'undefined') return false;
    if (!item.children) return;
    toggleFold({ item, lvl });
  };

  renderSecondaryActions = (actions, item) => {
    return <ListItemSecondaryAction>{actions.map((action, idx) => action({ item, idx }))}</ListItemSecondaryAction>;
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
      secondaryActions,
      lvl,
      getItemKey
    } = this.props;

    return (
      <ListItem
        key={getItemKey({ item, lvl })}
        button
        onClick={e => this.handleToggleFold({ e, item, toggleFold, lvl })}
      >
        <ListItemIcon>{iconItem({ item, isChild, expanded: isExpanded({ item, lvl }) })}</ListItemIcon>
        <Checkbox
          checked={isChecked(getItemKey({ item, lvl }))}
          onChange={(e, checked) =>
            this.handleOnCheckItem({
              e,
              checked,
              item,
              cascadeCheck,
              onCheckItem,
              lvl,
              getItemKey
            })
          }
          tabIndex={-1}
          disableRipple
        />
        <ListItemText primary={item.label} />
        {secondaryActions ? this.renderSecondaryActions(secondaryActions, item) : ''}
      </ListItem>
    );
  }
}

Item.propTypes = {
  item: Types.object,
  isChild: Types.bool,
  iconItem: Types.func,
  isExpanded: Types.func,
  isChecked: Types.func,
  cascadeCheck: Types.bool,
  onCheckItem: Types.func,
  toggleFold: Types.func,
  secondaryActions: Types.array,
  lvl: Types.number,
  getItemKey: Types.func
};

export const Childrens = props => {
  const { childClass = {}, childrens } = props;

  return (
    <List component="div" disablePadding className={classNames(childClass.treeItemNested)}>
      {childrens}
    </List>
  );
};
