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
import { TreeItemIcon } from './icons';

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
const defaultState = () => ({
  expanded: [],
  checked: []
});

// \ rendergeneric item internal fn \
const renderGenericCreator = ({
  parentFn,
  childFn: ChildFn,
  iconItem,
  onCheckItem,
  toggleFold,
  expanded,
  isExpanded,
  isChecked,
  cascadeCheck,
  style
}) => {
  const iterator = (item, isChild = false, lvl = 0) => {
    lvl = lvl + 1;
    if (item.children) {
      return parentFn({
        item,
        childClass: style,
        lvl,
        isChild,
        childrens: item.children.map(child => iterator(child, true, lvl)),
        iconItem,
        expanded,
        isExpanded,
        onCheckItem,
        isChecked,
        cascadeCheck,
        toggleFold
      });
    } else {
      return (
        <ChildFn
          item={item}
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
        />
      );
    }
  };
  return iterator;
};

// \ default checkItem fn \
const onTreeCheckItem = ({ check, items }) => {
  console.log(items, check);
};

// \ default Fold fn \
const onFoldItem = item => {
  console.log(item);
};

const onUnfoldItem = item => {
  console.log(item);
};

// \ default unFold fn \

class Tree extends Component {
  static displayName = 'Tree';
  static defaultProps = {
    treeData: [],
    renderGenericItemCreator: renderGenericCreator,
    renderParentItem: TreeParent,
    renderChildItem: TreeChild,
    renderItemIcon: TreeItemIcon,
    onFoldItem: onFoldItem,
    onUnfoldItem: onUnfoldItem,
    onCheckItem: onTreeCheckItem,
    expandedAll: true,
    cascadeCheck: true
  };

  constructor(props) {
    super(props);
    this.state = defaultState();

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
      iconFn: props.renderIcon,
      iconItem: props.renderItemIcon,
      onCheckItem: this.toggleCheck,
      toggleFold: this.toggleFold,
      expanded: props.expandedAll,
      isExpanded: this.isExpanded,
      isChecked: this.isChecked,
      cascadeCheck: props.cascadeCheck,
      style
    });
  }

  toggleFold = value => {
    const { expanded } = this.state;
    const currentIndex = expanded.indexOf(value);
    const newExpanded = [...expanded];

    if (currentIndex === -1) {
      newExpanded.push(value);
    } else {
      newExpanded.splice(currentIndex, 1);
    }

    this.setState({ expanded: newExpanded }, () => {
      if (currentIndex === -1) {
        this.props.onUnfoldItem(value);
      } else {
        this.props.onFoldItem(value);
      }
    });
  };

  toggleCheck = ({ checked: check, items = [], keys = [] }) => {
    const { checked } = this.state;
    const currentsIndexes = keys.map(key => ({ exists: checked.indexOf(key) !== -1, key }));
    const newChecked = [...checked];

    const length = currentsIndexes.length;
    let idx = 0;
    for (; idx < length; idx++) {
      let current = currentsIndexes[idx];
      if (!current.exists) {
        newChecked.push(current.key);
      } else {
        newChecked.splice(current.key, 1);
      }
    }

    this.setState({ checked: newChecked }, () => {
      this.props.onCheckItem({ check, items });
    });
  };

  isExpanded = item => {
    return this.state.expanded.indexOf(item) !== -1;
  };

  isChecked = item => {
    return this.state.checked.indexOf(item) !== -1;
  };

  render() {
    const { treeData, classes } = this.props;

    const rootClasses = [classes.root];
    return (
      <Grid container spacing={16}>
        <Grid item xs={12} md={12} className={classNames('tree-wrapper', rootClasses)}>
          <List component="nav" disablePadding>
            {treeData.map(datum => this.renderGenericItem(datum, false, 0))}
          </List>
        </Grid>
      </Grid>
    );
  }
}

// \ Prop Types \
let treeDataNode = Types.shape({
  label: Types.string.isRequired,
  expanded: Types.bool
});

treeDataNode.children = Types.arrayOf(treeDataNode);

Tree.propTypes = {
  treeData: Types.arrayOf(treeDataNode),
  renderGenericItemCreator: Types.func,
  renderParentItem: Types.func,
  renderChildrenItem: Types.func
};

// \ Exported \
export default withStyles(styles, { name: 'Tree' })(Tree);
