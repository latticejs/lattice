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
    onNodeClick: () => {},
    onNodeAdded: () => {}
  };

  constructor(args) {
    super(...args);
    this.state = {
      labelX: 0,
      labelY: 0,
      labelWidth: '50px',
      labelHeight: '20px',
      text: ''
    };
  }

  componentDidMount() {
    this.d3Node = select(this.node)
      .datum(this.props.data)
      .call(selection => enterNode(selection, { ...this.props, onTextChange: this.onTextChange }));
    this.updateLabelBounds();
  }

  componentDidUpdate() {
    this.d3Node.datum(this.props.data).call(updateNode);
  }

  updateLabelBounds = () => {
    var rect = this.label.getBoundingClientRect();
    this.setState({
      labelX: this.props.data.x - 20,
      labelY: this.props.data.y - 8,
      labelWidth: Math.max(50, rect.width),
      labelHeight: Math.max(20, rect.height)
    });
  };

  handleNodeClick = e => {
    const node = {
      title: this.props.name,
      x: this.props.data.x,
      y: this.props.data.y
    };

    if (this.props.editable) {
      this.props.editSelectedNode(node);
    }

    this.props.onNodeClick(node);
  };

  onTextChange = e => {
    const { value } = e.target;
    this.setState({
      text: value
    });
  };

  onKeyDown = e => {
    const { keyCode } = e;
    switch (keyCode) {
      case 13:
        // enter key
        this.props.onNodeAdded({
          ...this.props.data,
          name: this.state.text
        });
        this.props.closeNode();
        break;
      case 27:
        // esc key
        this.props.closeNode();
        break;
      default:
        return;
    }
  };

  render() {
    const { newNode, outerEl } = this.props;

    return (
      <g
        className={classNames(DEFAULTS.nodeClass, this.props.classes.dagNode)}
        onClick={e => this.handleNodeClick(e, this.name)}
        ref={node => (this.node = node)}
      >
        <circle />
        <text ref={node => (this.label = node)} className={this.props.classes.dagNodeText} />
        {newNode &&
          this.props.children({
            outerEl,
            onTextChange: this.onTextChange,
            onKeyDown: this.onKeyDown,
            value: this.state.text,
            labelX: this.state.labelX,
            labelY: this.state.labelY,
            labelWidth: this.state.labelWidth,
            labelHeight: this.state.labelHeight
          })}
      </g>
    );
  }
}
