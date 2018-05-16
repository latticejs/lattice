import React, { Component } from 'react';
import classNames from 'classnames';
import { select } from 'd3-selection';
import { DEFAULTS } from './dag'

const enterNode = (selection, name) => {
  selection
    .select('circle')
    .attr('r', (d) => {  return 50 }) // d.r

  insertTitleLinebreaks(selection, name);
}

const updateNode = (selection) => {
  selection
    .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
}

const insertTitleLinebreaks  = (gEl, title) => {
    const words = title.split(/\s+/g);
    const nwords = words.length;

    const el = gEl.select('text')
      .attr('text-anchor','middle')
      .attr('dy', `-${(nwords-1)*7.5}`);

    words.map((word, idx) => {
      const tspan = el.append('tspan').text(word);
      if (idx > 0) tspan.attr('x', 0).attr('dy', '15');
    })
  }

export default class Node extends Component {

  componentDidMount() {
    this.d3Node = select(this.node)
      .datum(this.props.data)
      .call((selection) => enterNode(selection, this.props.name))
  }

  componentDidUpdate() {
    this.d3Node.datum(this.props.data)
      .call(updateNode)
  }

  handle(e){
    console.log(this.props.name + ' been clicked')
  }

  render() {
    return (
      <g
        className={classNames(DEFAULTS.nodeClass, this.props.classes.dagNode)}
        ref={node => this.node = node}
      >
        <circle onClick={this.handle.bind(this)}/>
        <text className={this.props.classes.dagNodeText}></text>
      </g>
    );
  }
}

