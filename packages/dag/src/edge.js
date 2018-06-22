import React, { Component } from 'react';
import classNames from 'classnames';
import { select, selectAll } from 'd3-selection';
import { DEFAULTS } from './dag';

const enterEdge = (selection, ghostEdge) => {
  selection.attr('stroke-width', 1).attr('marker-end', 'url(#end)');
  if (ghostEdge) {
    // Note (dk): ghostEdge mode refers to an extra edge which appears
    // when you try to connect two nodes while in editable mode.
    selectAll(`.${DEFAULTS.nodeClass}`).each(function() {
      this.parentNode.appendChild(this);
    });
    selection.attr('stroke-width', 1).attr('marker-end', '');
  }
};

const updateEdge = selection => {
  selection
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y);
};

export default class Edge extends Component {
  static defaultProps = {
    onEdgeClick: () => {}
  };
  componentDidMount() {
    this.d3Edge = select(this.node)
      .datum(this.props.data)
      .call(selection => enterEdge(selection, this.props.ghostEdge));
  }

  componentDidUpdate() {
    this.d3Edge.datum(this.props.data).call(updateEdge);
  }

  handleEdgeClick = e => {
    this.props.onEdgeClick(e);
  };

  render() {
    // TODO (dk): apply classes.dagEdgeMarker class to marker-end (arrow)
    const { classes, ghostEdge } = this.props;
    const edgeClasses = [classes.dagEdge];
    if (ghostEdge) {
      edgeClasses.push(classes.dagEdgeGhost);
    }
    return (
      <line
        ref={node => (this.node = node)}
        className={classNames(DEFAULTS.linkClass, edgeClasses)}
        onClick={this.handleEdgeClick}
      />
    );
  }
}
