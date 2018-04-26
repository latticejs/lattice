import React, { Component } from 'react';
import classNames from 'classnames';
import DagCore from './dag';

const style = {}

export default class Dag extends Component {
  static displayName = 'Dag'

  static defaultProps = {
    xLoc: 175,
    yLoc: 100,
    nodes: [
      {title: "new concept", id: 0, x: (175), y: 100},
      {title: "new concept", id: 1, x: (175), y: 300}
    ],
    edges: [{
      source: {title: "new concept", id: 1, x: (175), y: 100},
      target: {title: "new concept", id: 1, x: (175), y: 300}
    }],
    width: 500,
    height: 500
  }

  state = this.createDefaultState()

  createDefaultState () {
    return {
      defaultNodeTitle: 'demo',
      selectedNode: null,
      selectedEdge: null,
      mouseDownNode: null,
      mouseDownLink: null,
      justDragged: false,
      justScaleTransGraph: false,
      lastKeyDown: -1,
      shiftNodeDrag: false,
      selectedText: null
    }
  }

  componentDidMount () {
    this.dagcore = new DagCore(this.node, { ...this.props, ...this.state })
    this.dagcore.updateGraph();
  }

  componentDidUpdate() {
    this.dagcore.updateGraph();
  }

  componentWillUnmount () {
    this.dagcore.destroyGraph();
  }

  render () {

    const { width, height, className, style, children, ...others } = this.props;

    return (
      <div
        className={classNames('dag-wrapper', className)}
        style={{ ...style, position: 'relative', cursor: 'default', width, height }}
        ref={node => this.node = node}
      >
      </div>
    )
  }
}
