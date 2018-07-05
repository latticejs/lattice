import React, { Component } from 'react';
import classNames from 'classnames';
import { select } from 'd3-selection';
import { DEFAULTS } from './dag';

const enterNode = (selection, props) => {
  selection.select('circle').attr('r', d => {
    return props.nodeRadius;
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
    .attr('stroke-width', 1)
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

  constructor(props) {
    super(props);
    this.state = {
      labelX: 0,
      labelY: 0,
      labelWidth: '50px',
      labelHeight: '20px',
      text: '',
      selected: false
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
    const { editable, editSelectedNode, onNodeClick, data, idx, name } = this.props;
    const node = {
      title: name,
      x: data.x,
      y: data.y,
      idx: idx
    };

    if (editable) {
      return editSelectedNode(node);
    }

    onNodeClick({ title: name });
    // add selected state
    this.setState(prevState => ({ selected: !prevState.selected }));
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
        if (this.state.text) {
          this.props.onNodeAdded({
            ...this.props.data,
            title: this.state.text
          });
        }
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

  deleteAction(event) {
    const { deleteNode, idx } = this.props;
    deleteNode({ event, idx });
  }

  getActions() {
    return {
      deleteAction: event => this.deleteAction(event),
      createEdgeAction: this.props.createEdge
    };
  }

  render() {
    const {
      newNode,
      outerEl,
      classes,
      editable,
      name,
      data,
      selectedClass,
      children,
      nodePanel,
      showPanel,
      showPanelIdx,
      idx
    } = this.props;

    const nodeClasses = [classes.dagNode];

    if (editable) {
      nodeClasses.push(classes.dagEditable);
    }

    if (this.state.selected) {
      // TODO(dk): clear other selected nodes (allow multiple selection?)
      nodeClasses.push(selectedClass);
    }
    return (
      <g
        className={classNames(DEFAULTS.nodeClass, nodeClasses)}
        onClick={this.handleNodeClick}
        ref={node => (this.node = node)}
        id={`dag__node--${name}`}
      >
        <circle />
        <text ref={node => (this.label = node)} className={classes.dagNodeText} />
        {newNode &&
          children({
            outerEl,
            onTextChange: this.onTextChange,
            onKeyDown: this.onKeyDown,
            value: this.state.text,
            labelX: this.state.labelX,
            labelY: this.state.labelY,
            labelWidth: this.state.labelWidth,
            labelHeight: this.state.labelHeight
          })}
        {showPanel &&
          showPanelIdx === idx &&
          nodePanel &&
          nodePanel({ outerEl, title: name, x: data.x, y: data.y, actions: this.getActions() })}
      </g>
    );
  }
}
