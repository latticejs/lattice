import React, { Component } from 'react';
import { List, AutoSizer, InfiniteLoader } from 'react-virtualized';

export default class ScrollLoader extends Component {
  static defaultProps = {
    list: [],
    overscanRowCount: 10,
    rvAutoSizerProps: {},
    rvListProps: {}
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

    return children({
      item: this.findItem({ index }),
      isEmpty: list.length === 0,
      index,
      key,
      style
    });
  };

  noRowsRenderer = () => {
    const { children } = this.props;
    return children({ isEmpty: true });
  };

  render() {
    const {
      loadMore, // function!
      rowHeight, // (number|function)!
      rowCount, // number
      isRowLoaded = this.defaultIsRowLoaded, // function
      overscanRowCount,
      width: parentWidth,
      height: parentHeight,
      rvAutoSizerProps,
      rvListProps
    } = this.props;

    return (
      <InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMore} rowCount={rowCount}>
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer disableWidth={!!parentWidth} disableHeight={!!parentHeight} {...rvAutoSizerProps}>
            {({ width, height }) => (
              <List
                {...rvListProps}
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
    );
  }
}
