import React, { Component } from 'react';
import classNames from 'classnames';
import { select, selectAll } from 'd3-selection';

import { DEFAULTS } from './dag';

const enterEdge = (selection, ghostEdge) => {
  if (ghostEdge) {
    // Note (dk): ghostEdge mode refers to an extra edge which appears
    // when you try to connect two nodes while in editable mode.
    selectAll(`.${DEFAULTS.nodeClass}`).each(function () {
      this.parentNode.appendChild(this);
    });
  }
};

const updateEdge = (selection) => {
  selection
    .attr('x1', (d) => d.source.x)
    .attr('y1', (d) => d.source.y)
    .attr('x2', (d) => d.target.x)
    .attr('y2', (d) => d.target.y);
};

export default class Edge extends Component {
  static defaultProps = {
    onEdgeClick: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: false,
    };
  }
  componentDidMount() {
    this.d3Edge = select(this.edge)
      .datum(this.props.data)
      .call((selection) => enterEdge(selection, this.props.ghostEdge));
  }

  componentDidUpdate() {
    this.d3Edge.datum(this.props.data).call(updateEdge);
  }

  handleEdgeClick = (e) => {
    const { editable, data, editSelectedEdge, onEdgeClick, idx, getNodeIdx, ghostEdge } = this.props;

    if (ghostEdge) {
      return;
    }

    if (editable) {
      return editSelectedEdge({
        ...data,
        idx,
      });
    }

    onEdgeClick({
      source: getNodeIdx(data.source),
      target: getNodeIdx(data.target),
    });
    // add selected state
    this.setState((prevState) => ({
      selected: !prevState.selected,
    }));
  };

  deleteAction(event) {
    const { deleteEdge, idx } = this.props;
    deleteEdge({ event, idx });
  }

  getActions() {
    return {
      deleteAction: (event) => this.deleteAction(event),
    };
  }

  render() {
    const {
      classes,
      editable,
      ghostEdge,
      children,
      data,
      showEdgePanel,
      showEdgePanelIdx,
      idx,
      selectedClass,
    } = this.props;
    const edgeClasses = [classes.dagEdge];

    if (ghostEdge) {
      edgeClasses.push(classes.dagEdgeGhost);
    }

    if (editable) {
      edgeClasses.push(classes.dagEditable);
    }

    if (this.state.selected) {
      // TODO(dk): clear other selected eddges (allow multiple selection?)
      edgeClasses.push(selectedClass);
    }

    return (
      <g className={classNames(DEFAULTS.linkClass, edgeClasses)} onClick={this.handleEdgeClick}>
        <line ref={(edge) => (this.edge = edge)}>
          {showEdgePanel && showEdgePanelIdx === idx && children && children({ ...data, actions: this.getActions() })}
        </line>
        {ghostEdge ? '' : <polygon id={`dag__line-${idx}`} className={DEFAULTS.arrowClass} />}
      </g>
    );
  }
}
