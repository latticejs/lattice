import React, { Component } from 'react';
import { default as MuiList } from '@material-ui/core/List';
import { List, AutoSizer, InfiniteLoader } from 'react-virtualized';

const defaultListProps = (props = {}) => ({
  ...props,
  component: 'div'
});

const defaultListItemProps = ({ key, style }) => ({
  key,
  component: 'div',
  style
});

export default class InfiniteList extends Component {
  static defaultProps = {
    list: [],
    overscanRowCount: 10,
    virtualizedListProps: {}
  };

  findItem = ({ index }) => {
    const { list, findItem } = this.props;

    if (findItem) {
      return findItem({ index });
    }

    return list[index];
  };

  defaultIsRowLoaded = ({ index }) => !!this.findItem({ index });

  rowRenderer = ({ index, key, style }) => {
    const { list, children } = this.props;
    const listItemProps = defaultListItemProps({ key, style });

    return children({
      item: this.findItem({ index }),
      isEmpty: list.length === 0,
      index,
      key,
      listItemProps
    });
  };

  noRowsRenderer = () => {
    const { children } = this.props;
    return children({ isEmpty: true, listItemProps: { component: 'div' } });
  };

  render() {
    const {
      loadMore, // function!
      rowHeight, // (number|function)!
      rowCount, // number
      isRowLoaded = this.defaultIsRowLoaded, // function
      listProps = defaultListProps(this.props.listProps),
      overscanRowCount,
      virtualizedListProps,
      width: parentWidth,
      height: parentHeight
    } = this.props;

    return (
      <MuiList {...listProps}>
        <InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMore} rowCount={rowCount}>
          {({ onRowsRendered, registerChild }) => (
            <AutoSizer>
              {({ width, height }) => (
                <List
                  {...virtualizedListProps}
                  onRowsRendered={onRowsRendered}
                  ref={registerChild}
                  rowCount={rowCount}
                  overscanRowCount={overscanRowCount}
                  rowHeight={rowHeight}
                  rowRenderer={this.rowRenderer}
                  noRowsRenderer={this.noRowsRenderer}
                  width={parentWidth || width}
                  height={parentHeight || height}
                />
              )}
            </AutoSizer>
          )}
        </InfiniteLoader>
      </MuiList>
    );
  }
}

//export const InfiniteList = ({ items }) => {
//return (
//<MuiList component="div">
//{items.map(i => (
//<ListItem key={i.id} component="div">
//<ListItemText primary={i.title} secondary="Secondary" />
//</ListItem>
//))}
//</MuiList>
//);
//};
