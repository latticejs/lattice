import React, { Component } from 'react';
import classNames from 'classnames';
import DagCore from './dag';

const style = {}

export default class Dag extends Component {
  static displayName = 'Dag'

  state = {}

  componentDidMount () {
    this.dagcore = new DagCore(this.node, { ...this.props, ...this.state })
    this.dagcore.simulation.on('tick', this.dagcore.updateGraph)
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
