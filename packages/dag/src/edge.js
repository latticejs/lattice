import React, { Component } from 'react';
import classNames from 'classnames';
import { select, selectAll } from 'd3-selection';

import { DEFAULTS } from './dag';

const enterEdge = (selection, ghostEdge) => {
  if (ghostEdge) {
    // Note (dk): ghostEdge mode refers to an extra edge which appears
    // when you try to connect two nodes while in editable mode.
    selectAll(`.${DEFAULTS.nodeClass}`).each(function() {
      this.parentNode.appendChild(this);
    });
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
    this.d3Edge = select(this.edge)
      .datum(this.props.data)
      .call(selection => enterEdge(selection, this.props.ghostEdge));
  }

  componentDidUpdate() {
    this.d3Edge.datum(this.props.data).call(updateEdge);
  }

  handleEdgeClick = e => {
    const { editable, data, editSelectedEdge, idx } = this.props;

    if (editable) {
      editSelectedEdge(Object.assign({}, data, { idx }));
    }
    this.props.onEdgeClick(e, data);
  };

  render() {
    // TODO (dk): apply classes.dagEdgeMarker class to marker-end (arrow)
    const { classes, editable, ghostEdge, children, data, showEdgePanel, showEdgePanelIdx, idx } = this.props;
    const edgeClasses = [classes.dagEdge];

    if (ghostEdge) {
      edgeClasses.push(classes.dagEdgeGhost);
    }

    if (editable) {
      edgeClasses.push(classes.dagEditable);
    }

    return (
      <g className={classNames(DEFAULTS.linkClass, edgeClasses)}>
        <line ref={edge => (this.edge = edge)} onClick={this.handleEdgeClick}>
          {showEdgePanel && showEdgePanelIdx === idx && children && children({ data })}
        </line>
        {ghostEdge ? '' : <polygon className="dag__edge-arrow" />}
      </g>
    );
  }
}
