import React, { Component } from 'react';
import classNames from 'classnames';
import { select } from 'd3-selection';
import { DEFAULTS } from './dag';

const DEFAULT_RADIUS = 50;

const enterNode = (selection, props) => {
  selection.select('circle').attr('r', d => {
    return props.radius || DEFAULT_RADIUS;
  });

  insertTitleLinebreaks(selection, props.name);
};

const updateNode = selection => {
  selection.attr('transform', d => `translate(${d.x}, ${d.y})`);
};

const insertTitleLinebreaks = (gEl, title) => {
  const words = title.split(/\s+/g);
  const nwords = words.length;

  const el = gEl
    .select('text')
    .attr('text-anchor', 'middle')
    .attr('dy', `-${(nwords - 1) * 7.5}`);

  words.forEach((word, idx) => {
    const tspan = el.append('tspan').text(word);
    if (idx > 0) {
      tspan.attr('x', 0).attr('dy', '15');
    }
  });
};

export default class Node extends Component {
  static defaultProps = {
    onClickNode: () => {}
  };
  componentDidMount() {
    this.d3Node = select(this.node)
      .datum(this.props.data)
      .call(selection => enterNode(selection, { ...this.props }));
  }

  componentDidUpdate() {
    this.d3Node.datum(this.props.data).call(updateNode);
  }

  handleNodeClick = e => {
    if (this.props.editable) {
      this.props.editSelectedNode(this.props.name);
    }

    this.props.onClickNode.call(this, e);
  };

  render() {
    return (
      <g
        className={classNames(DEFAULTS.nodeClass, this.props.classes.dagNode)}
        onClick={e => this.handleNodeClick(e, this.name)}
        ref={node => (this.node = node)}
      >
        <circle />
        <text className={this.props.classes.dagNodeText} />
      </g>
    );
  }
}
