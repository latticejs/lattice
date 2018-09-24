import React, { Component } from 'react';
import Types from 'prop-types';
import classNames from 'classnames';
// \ Material-UI \
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';

// \ Ours \
import TreeParent from './parent';
import { Item as TreeChild } from './child';
import { withTreeItemIcon } from './icons';

// \ Tree Material style \
const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    color: theme.palette.text.secondary,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize
  },
  treeItemNested: {
    paddingLeft: theme.spacing.unit * 4
  }
});

// \ reset internal state helper \
const defaultState = ({ treeData, expandedAll, cascadeUnFold, getItemKey }) => {
  let expandedAllData = [];
  if (expandedAll) {
    // Note (dk): if expandedAll prop is true then the tree should unfold all
    // the container items (those with childrens). So we call cascadeUnFold fn
    // from the top of treeData, and since treeData is an array we run it
    // through all the root items.
    expandedAllData = treeData.reduce(
      (all, item) => {
        return {
          ...all,
          ...cascadeUnFold({
            initial: { items: [], keys: [] },
            item,
            lvl: 1,
            getItemKey
          })
        };
      },
      { items: [], keys: [] }
    );
  }

  return {
    expanded: expandedAll ? expandedAllData.keys : [],
    checked: []
  };
};

// \ rendergeneric item internal fn \
const renderGenericCreator = ({
  parentFn,
  childFn: ChildFn,
  iconItem,
  onCheckItem,
  secondaryActions,
  getItemKey,
  toggleFold,
  expanded,
  isExpanded,
  isChecked,
  cascadeCheck,
  showCheck,
  markUnfoldedParent,
  style
}) => {
  const iterator = (item, isChild = false, lvl = 0, idx) => {
    lvl = lvl + 1;
    item.key = `lattice-tree-${idx}-${lvl}`;
    if (item.children) {
      return parentFn({
        item,
        key: item.key,
        childClass: style,
        lvl,
        isChild,
        secondaryActions,
        childrens: item.children.map((child, idxChild) => iterator(child, true, lvl, idxChild)),
        iconItem,
        expanded,
        isExpanded,
        onCheckItem,
        isChecked,
        cascadeCheck,
        toggleFold,
        getItemKey,
        showCheck,
        markUnfoldedParent
      });
    } else {
      return (
        <ChildFn
          key={item.key}
          item={item}
          secondaryActions={secondaryActions}
          childClass={style}
          isChild={isChild}
          lvl={lvl}
          onCheckItem={onCheckItem}
          toggleFold={toggleFold}
          expanded={expanded}
          isExpanded={isExpanded}
          isChecked={isChecked}
          cascadeCheck={cascadeCheck}
          iconItem={iconItem}
          getItemKey={getItemKey}
          showCheck={showCheck}
        />
      );
    }
  };
  return iterator;
};

class Tree extends Component {
  static displayName = 'Tree';
  static defaultProps = {
    treeData: [],
    secondaryActions: [],
    renderGenericItemCreator: renderGenericCreator,
    renderParentItem: TreeParent,
    renderChildItem: TreeChild,
    renderItemIcon: () => {},
    getItemKey: ({ item }) => item.key,
    onFoldItem: () => {},
    onUnfoldItem: () => {},
    onCheckItem: () => {},
    showChecks: true,
    expandedAll: false,
    cascadeCheck: false,
    markUnfoldedParent: false
  };

  constructor(props) {
    super(props);
    this.state = defaultState({ ...props, cascadeUnFold: this.cascadeUnFold });

    const style = {
      treeItemNested: props.classes.treeItemNested
    };
    // Note (dk): this will create our default renderGenericItem. What is a renderGenericItem? It's a function
    // used to know how to render the content, ie: how to render parent nodes and child nodes. While we are using
    // a parent/child notation it is actually up to how you parse it. renderGenericItem eventually receives the result
    // of each data iteration, a datum. Finally, renderGenericItemCreator creates a fn composing fns used to know
    // how to render childrens and parents.
    this.renderGenericItem = props.renderGenericItemCreator({
      parentFn: props.renderParentItem,
      childFn: props.renderChildItem,
      secondaryActions: props.secondaryActions,
      iconItem: withTreeItemIcon(props.renderItemIcon),
      onCheckItem: this.toggleCheck,
      getItemKey: props.getItemKey,
      toggleFold: this.toggleFold,
      expanded: props.expandedAll,
      isExpanded: this.isExpanded,
      isChecked: this.isChecked,
      cascadeCheck: props.cascadeCheck,
      showCheck: props.showChecks,
      markUnfoldedParent: props.markUnfoldedParent,
      style
    });
  }

  toggleFold = ({ item, lvl }) => {
    const { expanded } = this.state;
    const key = this.getItemKey({ item, lvl });
    const currentIndex = expanded.indexOf(key);
    const newExpanded = [...expanded];

    if (currentIndex === -1) {
      newExpanded.push(key);
    } else {
      newExpanded.splice(currentIndex, 1);
    }

    this.setState({ expanded: newExpanded }, () => {
      if (currentIndex === -1) {
        this.props.onUnfoldItem(item);
      } else {
        this.props.onFoldItem(item);
      }
    });
  };

  toggleCheck = ({ checked: check, items = [], keys = [] }) => {
    const { checked } = this.state;
    const currentsIndexes = keys.map(key => ({ pos: checked.indexOf(key), key }));
    const newChecked = [...checked];
    const length = currentsIndexes.length;
    let idx = 0;
    for (; idx < length; idx++) {
      let current = currentsIndexes[idx];
      if (current.pos === -1) {
        newChecked.push(current.key);
      } else {
        newChecked.splice(current.pos, 1);
      }
    }

    this.setState({ checked: newChecked }, () => {
      this.props.onCheckItem({ check, items });
    });
  };

  cascadeUnFold = ({ initial, item, lvl, key = '', getItemKey }) => {
    // Note (dk): cascadeUnFold is a recursive fn used to generate the
    // initial array of unfolded items (keys). This fn should be used
    // only to initialize the expanded state at the constructor phase.
    // Further modifications to the expanded state are handled through
    // the toggleFold fn.
    if (item.children) {
      initial.items.push(item);
      initial.keys.push(getItemKey({ item, lvl }));
      lvl = lvl + 1;
      return item.children.reduce((initial, subItem, idx) => {
        return {
          ...initial,
          ...this.cascadeUnFold({
            initial,
            item: subItem,
            key: getItemKey({ item, lvl }),
            lvl,
            getItemKey
          })
        };
      }, initial);
    }
  };

  isExpanded = ({ item, lvl }) => {
    return this.state.expanded.indexOf(this.getItemKey({ item, lvl })) !== -1;
  };

  isChecked = item => {
    return this.state.checked.indexOf(item) !== -1;
  };

  getItemKey(params) {
    return this.props.getItemKey(params);
  }

  render() {
    const { treeData, classes } = this.props;

    const rootClasses = [classes.root];
    return (
      <Grid container spacing={16}>
        <Grid item xs={12} md={12} className={classNames('tree-wrapper', rootClasses)}>
          <List component="div" disablePadding>
            {treeData.map((datum, idx) => this.renderGenericItem(datum, false, 0, idx))}
          </List>
        </Grid>
      </Grid>
    );
  }
}

// \ Prop Types \
let treeDataNode = Types.shape({
  label: Types.oneOfType([Types.element, Types.string]).isRequired
});

treeDataNode.children = Types.arrayOf(treeDataNode);

Tree.propTypes = {
  treeData: Types.arrayOf(treeDataNode),
  renderGenericItemCreator: Types.func,
  renderParentItem: Types.func,
  renderChildItem: Types.func,
  secondaryActions: Types.array,
  renderItemIcon: Types.func,
  getItemKey: Types.func,
  onFoldItem: Types.func,
  onUnfoldItem: Types.func,
  onCheckItem: Types.func,
  showChecks: Types.bool,
  markUnfoldedParent: Types.bool,
  expandedAll: Types.bool,
  cascadeCheck: Types.bool
};

// \ Exported \
export default withStyles(styles, { name: 'Tree' })(Tree);
