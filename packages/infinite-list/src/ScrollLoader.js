import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, AutoSizer, InfiniteLoader } from 'react-virtualized';
import { Scrollbars } from 'react-custom-scrollbars';

const disableScroll = (style = {}) => ({
  ...style,
  overflowX: false,
  overflowY: false,
});

class ScrollLoader extends Component {
  list = null;
  scroll = null;

  static defaultProps = {
    list: [],
    rvInfiniteLoaderProps: {},
    rvAutoSizerProps: {},
    rvListProps: {},
    rvScrollProps: {},
  };

  registerRef = (instance, registerChild) => {
    registerChild(instance);

    this.list = instance;

    if (this.props.rvListProps.ref) {
      this.props.rvListProps.ref(this.list);
    }
  };

  registerScroll = (instance) => {
    if (!instance) {
      return;
    }

    this.scroll = instance;

    this.scroll.scrollToRow = (index) => {
      this.scroll.scrollTop(this.list.getOffsetForRow({ index }));
    };

    if (this.props.rvScrollProps.ref) {
      this.props.rvScrollProps.ref(this.scroll);
    }
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
      style,
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
      rvInfiniteLoaderProps,
      rvAutoSizerProps,
      rvListProps,
      rvScrollProps,
    } = this.props;

    return (
      <InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMore} rowCount={rowCount} {...rvInfiniteLoaderProps}>
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer disableWidth={!!parentWidth} disableHeight={!!parentHeight} {...rvAutoSizerProps}>
            {({ width, height }) => (
              <Scrollbars
                autoHide
                {...rvScrollProps}
                ref={this.registerScroll}
                style={{ width: parentWidth || width, height: parentHeight || height }}
                onScroll={this.handleScroll}
              >
                <List
                  {...rvListProps}
                  ref={(instance) => this.registerRef(instance, registerChild)}
                  onRowsRendered={onRowsRendered}
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
  rvInfiniteLoaderProps: PropTypes.object,
  rvAutoSizerProps: PropTypes.object,
  rvListProps: PropTypes.object,
  rvScrollProps: PropTypes.object,
};

export default ScrollLoader;
