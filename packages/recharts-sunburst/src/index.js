import React, { Component } from 'react';
import classNames from 'classnames';
// d3
import { hierarchy, partition } from 'd3-hierarchy';
import { arc } from 'd3-shape';

// recharts
import Layer from 'recharts/lib/container/Layer';
import Surface from 'recharts/lib/container/Surface';
import {
  findChildByType,
  getPresentationAttributes,
  filterSvgElements,
  validateWidthHeight
} from 'recharts/lib/util/ReactUtils';
import Tooltip from 'recharts/lib/component/Tooltip';
import { getValueByDataKey } from 'recharts/lib/util/ChartUtils';
import { shallowEqual } from 'recharts/lib/util/shallowEqual';

import Animate from 'react-smooth'; // transitive dep

const computeData = (data, radius, dataKey) => {
  const dataPartition = partition().size([2 * Math.PI, radius * radius]);

  // Turn the data into a d3 hierarchy and calculate the sums.
  const root = hierarchy(data)
    .sum(d => {
      return d[dataKey];
    })
    .sort((a, b) => {
      return b.value - a.value;
    });

  // For efficiency, filter nodes to keep only those large enough to see.
  return dataPartition(root)
    .descendants()
    .filter(d => {
      return d.x1 - d.x0 > 0.005; // 0.005 radians = 0.29 degrees
    });
};

const dataArc = arc()
  .startAngle(d => {
    return d.x0;
  })
  .endAngle(d => {
    return d.x1;
  })
  .innerRadius(d => {
    return Math.sqrt(d.y0);
  })
  .outerRadius(d => {
    return Math.sqrt(d.y1);
  });

export default class Sunburst extends Component {
  static displayName = 'Sunburst';

  static defaultProps = {
    dataKey: 'value',
    nameKey: 'name',
    isAnimationActive: false,
    isUpdateAnimationActive: false,
    animationBegin: 0,
    animationDuration: 600,
    animationEasing: 'ease-out'
  };

  state = {
    ...Sunburst.createDefaultState(),
    data: this.props.data
  };

  /**
   * Returns default, reset state for the sunburst chart.
   * @return {Object} Whole new state
   */
  static createDefaultState() {
    return {
      isTooltipActive: false,
      activeNode: null,
      data: null
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== prevState.data) {
      return {
        ...Sunburst.createDefaultState(),
        data: nextProps.data
      };
    }

    return null;
  }

  shouldComponentUpdate(props, state) {
    return !shallowEqual(props, this.props) || !shallowEqual(state, this.state);
  }

  handleMouseEnter(node, e) {
    const { onMouseEnter, children } = this.props;
    const tooltipItem = findChildByType(children, Tooltip);
    this.setState(
      {
        isTooltipActive: tooltipItem ? true : false,
        activeNode: node
      },
      () => {
        if (onMouseEnter) {
          onMouseEnter(node, e);
        }
      }
    );
  }

  handleMouseLeave(node, e) {
    const { onMouseLeave } = this.props;
    this.setState(
      {
        isTooltipActive: false,
        activeNode: null
      },
      () => {
        if (onMouseLeave) {
          onMouseLeave(node, e);
        }
      }
    );
  }

  handleClick(node) {
    const { onClick } = this.props;

    if (onClick) {
      onClick(node);
    }
  }

  renderAnimatedItem(content, node, nodeProps, isLeaf) {
    const {
      isAnimationActive,
      animationBegin,
      animationDuration,
      animationEasing,
      isUpdateAnimationActive
    } = this.props;

    const event = {
      onMouseEnter: this.handleMouseEnter.bind(this, node, nodeProps),
      onMouseLeave: this.handleMouseLeave.bind(this, node, nodeProps),
      onClick: this.handleClick.bind(this, node, nodeProps)
    };
    if (!node.depth) return;
    const position = node.depth ? node.parent.children.indexOf(node) : 0;
    return (
      <Animate
        from={{ t: 0 }}
        to={{ t: 1 }}
        duration={animationDuration}
        easing={animationEasing}
        isActive={isUpdateAnimationActive}
      >
        {() => {
          return (
            <Animate
              from="0"
              to="1"
              attributeName="opacity"
              easing={animationEasing}
              isActive={isAnimationActive}
              duration={animationDuration}
              begin={(node.depth + position * 0.1) * 350 + animationBegin}
            >
              <Layer {...event}>
                {this.renderContentItem(content, node, {
                  ...nodeProps,
                  isAnimationActive,
                  isUpdateAnimationActive
                })}
              </Layer>
            </Animate>
          );
        }}
      </Animate>
      // <Smooth
      //   from={{ x, y, width, height }}
      //   to={{ x, y, width, height }}
      //   duration={animationDuration}
      //   easing={animationEasing}
      //   isActive={isUpdateAnimationActive}
      // >
      //   {({ x: currX, y: currY, width: currWidth, height: currHeight }) => (
      //     <Smooth
      //       from={`translate(${translateX}px, ${translateX}px)`}
      //       to="translate(0, 0)"
      //       attributeName="transform"
      //       begin={animationBegin}
      //       easing={animationEasing}
      //       isActive={isAnimationActive}
      //       duration={animationDuration}
      //     >
      //       <Layer {...event}>
      //         {this.renderContentItem(content, node, {
      //           ...nodeProps,
      //           isAnimationActive,
      //           isUpdateAnimationActive: isUpdateAnimationActive,
      //           width: currWidth,
      //           height: currHeight,
      //           x: currX,
      //           y: currY
      //         })}
      //       </Layer>
      //     </Smooth>
      //   )}
      // </Smooth>
    );
  }

  renderContentItem(content, node, nodeProps) {
    if (React.isValidElement(content)) {
      return React.cloneElement(content, nodeProps);
    } else if (typeof content === 'function') {
      return content(nodeProps);
    }
    const { nameKey, colors = {} } = this.props;
    const { activeNode } = this.state;
    let opacity = 1;
    if (activeNode) {
      const ancestors = activeNode.ancestors();
      opacity = ancestors.filter(n => n.data[nameKey] === node.data[nameKey]).length > 0 ? 1 : 0.3;
    }
    const { depth, fill = 'purple', stroke = 'white' } = nodeProps;
    const name = node.data[nameKey];

    return (
      <path
        display={depth ? null : 'none'}
        d={dataArc(nodeProps)}
        fillRule={'evenodd'}
        {...getPresentationAttributes(this.props)}
        fill={node.data.fill || colors[name] || fill}
        stroke={node.data.stroke || stroke}
        style={{ opacity }}
      />
    );
  }

  // renderNode(node, index, root) {
  renderNode(root, node, i) {
    const { content } = this.props;
    const nodeProps = { ...getPresentationAttributes(this.props), ...node, root };
    const isLeaf = !node.children || !node.children.length;
    return (
      <Layer key={`recharts-sunburst-node-${i}`} className={`recharts-sunburst-depth-${node.depth}`}>
        {this.renderAnimatedItem(content, node, nodeProps, isLeaf)}
        {node.children && node.children.length
          ? node.children.map((child, index) => this.renderNode(node, child, index))
          : null}
      </Layer>
    );
  }

  renderAllNodes() {
    const { width, height, data, dataKey, nameKey } = this.props;
    const radius = Math.min(width, height) / 2;
    const root = computeData({ [nameKey]: 'root', children: data }, radius, dataKey);

    return (
      <Layer transform={`translate( ${width / 2} , ${height / 2})`}>
        {root.map((node, index) => this.renderNode(root, node, index))}
      </Layer>
    );
  }

  renderTooltip() {
    const { children, nameKey } = this.props;
    const tooltipItem = findChildByType(children, Tooltip);

    if (!tooltipItem) {
      return null;
    }

    const { width, height } = this.props;
    const { isTooltipActive, activeNode } = this.state;
    const viewBox = { x: 0, y: 0, width, height };

    let coordinate = null;

    if (activeNode) {
      const [x, y] = dataArc.centroid(activeNode);

      coordinate = {
        x: x + width / 2,
        y: y + height / 2
      };
    }

    const payload =
      isTooltipActive && activeNode
        ? [
            {
              payload: activeNode,
              name: getValueByDataKey(activeNode.data, nameKey, ''),
              value: activeNode.value //getValueByDataKey(activeNode, dataKey),
            }
          ]
        : [];

    return React.cloneElement(tooltipItem, {
      viewBox,
      active: isTooltipActive,
      coordinate,
      label: '',
      payload
    });
  }

  render() {
    if (!validateWidthHeight(this)) {
      return null;
    }

    const { width, height, className, style, children, ...others } = this.props;
    const attrs = getPresentationAttributes(others);

    return (
      <div
        className={classNames('recharts-wrapper', className)}
        style={{ ...style, position: 'relative', cursor: 'default', width, height }}
      >
        <Surface {...attrs} width={width} height={height}>
          {this.renderAllNodes()}
          {filterSvgElements(children)}
        </Surface>
        {this.renderTooltip()}
      </div>
    );
  }
}

// pureRender(Sunburst);
