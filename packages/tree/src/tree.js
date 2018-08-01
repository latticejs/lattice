import React, { Component } from 'react';
import Types from 'prop-types';
import classNames from 'classnames';
// \ Material-UI \
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';

// \ Ours \
import TreeParent from './parent';
import { ChildLabel as TreeChild } from './child';
import { TreeIcon } from './icons';

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
  treeChild: {
    display: 'flex',
    alignItems: 'flex-end',
    width: '100%'
  },
  itemContainer: {
    padding: '5px'
  },
  treeIconContainer: {
    '& svg': {
      display: 'flex',
      alignSelf: 'flex-end',
      marginLeft: 'auto'
    }
  },
  treeHierarchyIcon: {
    display: 'inline-flex',
    height: theme.spacing.unit * 6,
    width: theme.spacing.unit * 6,
    border: '1px dotted #e0e0e0',
    borderWidth: '0 0 1px 1px'
  },
  treeLineIcon: {
    display: 'inline-flex',
    height: theme.spacing.unit * 6,
    width: theme.spacing.unit * 6,
    border: '1px dotted #e0e0e0',
    borderWidth: '0 0 0 1px'
  },
  treeTopIcon: {
    display: 'inline-flex',
    height: theme.spacing.unit * 6,
    width: theme.spacing.unit * 6,
    border: 'none'
  }
});

// \ reset internal state helper \
const defaultState = () => ({});

// \ rendergeneric item internal fn \
const renderGenericCreator = ({ parentFn, childFn, iconFn, style }) => {
  const iterator = (item, isChild = false, lvl = 0) => {
    lvl = lvl + 1;
    if (item.children) {
      return parentFn({
        item,
        childClass: style.child,
        isChild: true,
        lvl,
        childrens: item.children.map(child => iterator(child, true, lvl)),
        iconFn
      });
    } else {
      return childFn({ item, childClass: style.child, isChild, topIcon: lvl === 1, lvl, iconFn });
    }
  };
  return iterator;
};

class Tree extends Component {
  static displayName = 'Tree';
  static defaultProps = {
    treeData: [],
    renderGenericItemCreator: renderGenericCreator,
    renderParentItem: TreeParent,
    renderChildItem: TreeChild,
    renderIconItem: TreeIcon
  };

  constructor(props) {
    super(props);
    this.state = defaultState();

    const style = {
      child: {
        child: props.classes.treeChild,
        iconContainer: props.classes.treeIconContainer,
        itemContainer: props.classes.itemContainer,
        hierarchyIcon: props.classes.treeHierarchyIcon,
        lineIcon: props.classes.treeLineIcon,
        topIcon: props.classes.treeTopIcon
      }
    };
    // Note (dk): this will create our default renderGenericItem. What is a renderGenericItem? It's a function
    // used to know how to render the content, ie: how to render parent nodes and child nodes. While we are using
    // a parent/child notation it is actually up to how you parse it. renderGenericItem eventually receives the result
    // of each data iteration, a datum. Finally, renderGenericItemCreator creates a fn composing fns used to know
    // how to render childrens and parents.
    this.renderGenericItem = props.renderGenericItemCreator({
      parentFn: props.renderParentItem,
      childFn: props.renderChildItem,
      iconFn: props.renderIconItem,
      style
    });
  }

  render() {
    const { treeData, classes } = this.props;

    const rootClasses = [classes.root];
    return (
      <Grid container spacing={16}>
        <Grid item xs={12} md={12} className={classNames('tree-wrapper', rootClasses)}>
          {treeData.map(datum => this.renderGenericItem(datum))}
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
