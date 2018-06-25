import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, AutoSizer, InfiniteLoader } from 'react-virtualized';
import { Scrollbars } from 'react-custom-scrollbars';

const disableScroll = (style = {}) => ({
  ...style,
  overflowX: false,
  overflowY: false
});

class ScrollLoader extends Component {
  list = null;

  static defaultProps = {
    list: [],
    rvInfiniteLoader: {},
    rvAutoSizerProps: {},
    rvListProps: {}
  };

  registerRef = (instance, registerChild) => {
    registerChild(instance);
    this.list = instance;
  };

  handleScroll = ({ target }) => {
    const { scrollTop, scrollLeft } = target;

    const { Grid: grid } = this.list;

    grid.handleScrollEvent({ scrollTop, scrollLeft });
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
      width: parentWidth,
      height: parentHeight,
      rvInfiniteLoader,
      rvAutoSizerProps,
      rvListProps
    } = this.props;

    return (
      <InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMore} rowCount={rowCount} {...rvInfiniteLoader}>
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer disableWidth={!!parentWidth} disableHeight={!!parentHeight} {...rvAutoSizerProps}>
            {({ width, height }) => (
              <Scrollbars
                autoHide
                style={{ width: parentWidth || width, height: parentHeight || height }}
                onScroll={this.handleScroll}
              >
                <List
                  {...rvListProps}
                  onRowsRendered={onRowsRendered}
                  ref={instance => this.registerRef(instance, registerChild)}
                  rowCount={rowCount}
                  rowHeight={rowHeight}
                  rowRenderer={this.rowRenderer}
                  noRowsRenderer={this.noRowsRenderer}
                  width={parentWidth || width}
                  height={parentHeight || height}
                  style={disableScroll(rvListProps.style)}
                />
              </Scrollbars>
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    );
  }
}

ScrollLoader.propTypes = {
  children: PropTypes.func.isRequired,
  list: PropTypes.array.isRequired,
  loadMore: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
  rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).isRequired,
  findItem: PropTypes.func,
  isRowLoaded: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
  rvInfiniteLoader: PropTypes.object,
  rvAutoSizerProps: PropTypes.object,
  rvListProps: PropTypes.object
};

export default ScrollLoader;
