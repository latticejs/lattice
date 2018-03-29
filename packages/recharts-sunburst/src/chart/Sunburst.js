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

  renderNode(node, index, arc) {
    let opacity = 1;
    return (
      <path
        key={`path-${index}`}
        display={node.depth ? null : 'none'}
        d={arc(node)}
        fillRule={'evenodd'}
        // fill={colors[node.data.name]}
        fill="#ccc"
        style={{ opacity }}
        // onMouseOver={(...args) => this.handleMouseOver(...args, node)}
      />
    )

  }

  renderAllNodes () {
    const { width, height, data, dataKey } = this.props;
    const radius = Math.min(width, height) / 2;

    const root = computeData(data, radius, dataKey)
    const dataArc = arc()
      .startAngle((d) => { return d.x0; })
      .endAngle((d) => { return d.x1; })
      .innerRadius((d) => { return Math.sqrt(d.y0); })
      .outerRadius((d) => { return Math.sqrt(d.y1); });

    return (
      <Layer transform={`translate( ${width/2} , ${height/2})`}>
        {root.map((node, index) => this.renderNode(node, index, dataArc))}
      </Layer>
    )
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
        {/* {this.renderTooltip()} */}
      </div>
    );    
  }
}
