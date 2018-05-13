import React, { Component } from 'react';
import { select } from 'd3-selection';
import { DEFAULTS } from './dag';

const enterEdge = (selection, theme) => {
  selection
    .attr('stroke-width', 2)
    .attr('fill', 'purple') // use theme
    .attr('stroke', 'black')  // use theme
}

const updateEdge = (selection) => {
  selection
    .attr("x1", (d) => d.source.x )
    .attr("y1", (d) => d.source.y )
    .attr("x2", (d) => d.target.x )
    .attr("y2", (d) => d.target.y );
}

export default class Edge extends Component {

  componentDidMount() {
    this.d3Edge = select(this.node)
      .datum(this.props.data)
      .call((selection) => enterEdge(selection, this.props.theme));
  }

  componentDidUpdate() {
    this.d3Edge.datum(this.props.data)
      .call(updateEdge);
  }

  render() {
    return (
      <line ref={node => this.node = node}
        className={DEFAULTS.linkClass} />
    );
  }
}
