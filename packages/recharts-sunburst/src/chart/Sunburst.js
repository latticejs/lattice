import React, { Component } from 'react';
import classNames from 'classnames';
// recharts
import Layer from 'recharts/lib/container/Layer';
import Surface from 'recharts/lib/container/Surface';
import {
  findChildByType,
  getPresentationAttributes,
  filterSvgElements,
  validateWidthHeight,
  isSsr
} from 'recharts/lib/util/ReactUtils';
import Tooltip from 'recharts/lib/component/Tooltip';
import { getValueByDataKey } from 'recharts/lib/util/ChartUtils';
import { shallowEqual } from 'recharts/lib/util/PureRender';

import Smooth from 'react-smooth'; // transitive dep

// d3
import { hierarchy, partition } from 'd3-hierarchy';
import { arc } from 'd3-shape';

const computeData = (data, radius, dataKey) => {
  const dataPartition = partition().size([2 * Math.PI, radius * radius]);

  // Turn the data into a d3 hierarchy and calculate the sums.
  const root = hierarchy(data)
    .sum((d) => { return d[dataKey]; })
    .sort((a, b) => { return b.value - a.value; });

  // For efficiency, filter nodes to keep only those large enough to see.
  return dataPartition(root)
    .descendants()
    .filter((d) => {
      return (d.x1 - d.x0 > 0.005); // 0.005 radians = 0.29 degrees
    });
}

const dataArc = arc()
.startAngle((d) => { return d.x0; })
.endAngle((d) => { return d.x1; })
.innerRadius((d) => { return Math.sqrt(d.y0); })
.outerRadius((d) => { return Math.sqrt(d.y1); });

export default class Sunburst extends Component {
  static displayName = 'Sunburst'

  static defaultProps = {
    dataKey: 'value',
    // isAnimationActive: !isSsr(),
    // isUpdateAnimationActive: !isSsr(),

    isAnimationActive: false,
    isUpdateAnimationActive: false,

    animationBegin: 0,
    animationDuration: 1500,
    animationEasing: 'linear',
  }

  state = this.createDefaultState()

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState(this.createDefaultState());
    }
  }

  shouldComponentUpdate(props, state) {
    return !shallowEqual(props, this.props) || !shallowEqual(state, this.state);
  }

  /**
   * Returns default, reset state for the sunburst chart.
   * @return {Object} Whole new state
   */
  createDefaultState() {
    return {
      isTooltipActive: false,
      activeNode: null,
    };
  }

  handleMouseEnter(node, e) {
    const { onMouseEnter, children } = this.props;
    const tooltipItem = findChildByType(children, Tooltip);
    if (tooltipItem) {
      this.setState({
        isTooltipActive: true,
        activeNode: node,
      }, () => {
        if (onMouseEnter) {
          onMouseEnter(node, e);
        }
      });
    } else if (onMouseEnter) {
      onMouseEnter(node, e);
    }
  }

  handleMouseLeave(node, e) {
    const { onMouseLeave, children } = this.props;
    const tooltipItem = findChildByType(children, Tooltip);

    if (tooltipItem) {
      this.setState({
        isTooltipActive: false,
        activeNode: null,
      }, () => {
        if (onMouseLeave) {
          onMouseLeave(node, e);
        }
      });
    } else if (onMouseLeave) {
      onMouseLeave(node, e);
    }
  }

  handleClick(node) {
    const { onClick } = this.props;

    if (onClick) {
      onClick(node);
    }
  }
 
  renderAnimatedItem(content, nodeProps, isLeaf) {
    const { isAnimationActive, animationBegin, animationDuration,
      animationEasing, isUpdateAnimationActive } = this.props;
    const { width, height, x, y } = nodeProps;
    const translateX = parseInt((Math.random() * 2 - 1) * width, 10);
    let event = {};

    // if (isLeaf) {
      event = {
        onMouseEnter: this.handleMouseEnter.bind(this, nodeProps),
        onMouseLeave: this.handleMouseLeave.bind(this, nodeProps),
        onClick: this.handleClick.bind(this, nodeProps),
      };
    // }

    return (
      <Smooth
        from={{ x, y, width, height }}
        to={{ x, y, width, height }}
        duration={animationDuration}
        easing={animationEasing}
        isActive={isUpdateAnimationActive}
      >
        {
        ({ x: currX, y: currY, width: currWidth, height: currHeight }) => (
          <Smooth
            from={`translate(${translateX}px, ${translateX}px)`}
            to="translate(0, 0)"
            attributeName="transform"
            begin={animationBegin}
            easing={animationEasing}
            isActive={isAnimationActive}            
            duration={animationDuration}
          >
            <Layer {...event}>
              {
              this.renderContentItem(content, {
                ...nodeProps,
                isAnimationActive,
                isUpdateAnimationActive: !isUpdateAnimationActive,
                width: currWidth,
                height: currHeight,
                x: currX,
                y: currY,
              })
            }
            </Layer>
          </Smooth>
        )
      }
      </Smooth>
    );
  }

  renderContentItem(content, nodeProps) {
    if (React.isValidElement(content)) {
      return React.cloneElement(content, nodeProps);
    } else if (typeof content === 'function') {
      return content(nodeProps);
    }

    return (
      <path
        display={nodeProps.depth ? null : 'none'}
        d={dataArc(nodeProps)}
        fillRule={'evenodd'}
        // fill={colors[node.data.name]}
        fill="purple"
        stroke="#fff"
        // style={{ opacity }}
        // {...getPresentationAttributes(this.props)}
      />
    );
  }

  // renderNode(node, index, root) {
  renderNode(root, node, i) {    
    const { content } = this.props;
    const nodeProps = { ...getPresentationAttributes(this.props), ...node, root };
    const isLeaf = !node.children || !node.children.length;
    // const events = {
    //   onMouseEnter: this.handleMouseEnter.bind(this, node),
    //   onMouseLeave: this.handleMouseLeave.bind(this, node),
    //   onClick: this.handleClick.bind(this, nodeProps),
    // };

    return (
      <Layer key={`recharts-sunburst-node-${i}`} className={`recharts-sunburst-depth-${node.depth}`}>
        {this.renderAnimatedItem(content, nodeProps, isLeaf)}
        {
          node.children && node.children.length ?
            node.children.map((child, index) => this.renderNode(node, child, index)) : null
        }
      </Layer>
    );
    

    // return (
    //   <path
    //     {...events}
    //     key={`path-${index}`}
    //     display={node.depth ? null : 'none'}
    //     d={dataArc(node)}
    //     fillRule={'evenodd'}
    //     // fill={colors[node.data.name]}
    //     fill="purple"
    //     stroke="#fff"
    //     style={{ opacity }}
    //     {...getPresentationAttributes(this.props)}
    //   />
    // )
  }

  renderAllNodes () {
    const { width, height, data, dataKey, nameKey } = this.props;
    const radius = Math.min(width, height) / 2;
    const root = computeData({[nameKey]: 'root',  children: data}, radius, dataKey);

    return (
      <Layer transform={`translate( ${width/2} , ${height/2})`}>
        {root.map((node, index) => this.renderNode(root, node, index))}
      </Layer>
    )
  }

  renderTooltip() {
    const { children, nameKey } = this.props;
    const tooltipItem = findChildByType(children, Tooltip);

    if (!tooltipItem) { return null; }

    const { width, height, dataKey } = this.props;
    const { isTooltipActive, activeNode } = this.state;
    const viewBox = { x: 0, y: 0, width, height };

    let coordinate = null;

    if (activeNode) {
      const [x, y] = dataArc.centroid(activeNode);
      coordinate = {
        x: x + width / 2,
        y: y + height / 2
      }
    }
    
    const payload = isTooltipActive && activeNode ? [{
      payload: activeNode,
      name: getValueByDataKey(activeNode.data, nameKey, ''),
      value: activeNode.value//getValueByDataKey(activeNode, dataKey),
    }] : [];

    return React.cloneElement(tooltipItem, {
      viewBox,
      active: isTooltipActive,
      coordinate,
      label: '',
      payload,
    });
  }

  render () {
    if (!validateWidthHeight(this)) { return null; }

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
};

// pureRender(Sunburst);
