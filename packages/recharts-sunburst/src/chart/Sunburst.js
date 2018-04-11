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

export default class Sunburst extends Component {
  static displayName = 'Sunburst'
  state = this.createDefaultState();

  dataArc = arc()
      .startAngle((d) => { return d.x0; })
      .endAngle((d) => { return d.x1; })
      .innerRadius((d) => { return Math.sqrt(d.y0); })
      .outerRadius((d) => { return Math.sqrt(d.y1); });


  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState(this.createDefaultState());
    }
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
 
  renderNode(node, index, root) {
    const { dataArc } = this;
    const nodeProps = { ...getPresentationAttributes(this.props), ...node, root };
    const isLeaf = !node.children || !node.children.length;
    const events = {
      onMouseEnter: this.handleMouseEnter.bind(this, node),
      onMouseLeave: this.handleMouseLeave.bind(this, node),
    };

    let opacity = 1;

    return (
      <path
        {...events}
        key={`path-${index}`}
        display={node.depth ? null : 'none'}
        d={dataArc(node)}
        fillRule={'evenodd'}
        // fill={colors[node.data.name]}
        fill="purple"
        stroke="#fff"
        style={{ opacity }}
        {...getPresentationAttributes(this.props)}
      />
    )
  }

  renderAllNodes () {
    const { width, height, data, dataKey, nameKey } = this.props;
    const radius = Math.min(width, height) / 2;
    const root = computeData({[nameKey]: 'root',  children: data}, radius, dataKey);

    return (
      <Layer transform={`translate( ${width/2} , ${height/2})`}>
        {root.map((node, index) => this.renderNode(node, index, root))}
      </Layer>
    )
  }

  renderTooltip() {
    const { dataArc } = this;
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
}
