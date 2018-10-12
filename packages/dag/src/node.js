import React, { Component } from 'react';
import classNames from 'classnames';
import { select } from 'd3-selection';
import { DEFAULTS } from './dag';
import Input from '@material-ui/core/Input';

const enterNode = (selection, props) => {
  selection.select('circle').attr('r', d => {
    return props.nodeRadius;
  });

  insertTitleLinebreaks(selection, props.data.title);
};

const updateNode = selection => {
  selection.attr('transform', d => {
    if (!d.x) return;
    return `translate(${d.x}, ${d.y})`;
  });
};

const insertTitleLinebreaks = (gEl, title = '') => {
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
      iterations: 2,
      labelX: 0,
      labelY: 0,
      labelWidth: '50px',
      labelHeight: '20px',
      text: '',
      selected: false
    };
  }

  componentDidMount() {
    select(this.node)
      .datum(this.props.data)
      .call(selection => enterNode(selection, { ...this.props, onTextChange: this.onTextChange }))
      .call(updateNode);

    if (this.props.newNode) {
      this.updateNodeBounds();
    }
  }

  componentDidUpdate(prevState, prevProps) {
    select(this.node)
      .datum(this.props.data)
      .call(updateNode);
  }

  updateNodeBounds = () => {
    // Note (dk): this fn is a helper for getting node size/position.
    // This info will be used by the input  to accomodate inside the node.
    // input is an html element getting positioned inside an svg one.
    if (!this.node) return;
    var node = this.node.getBoundingClientRect();
    const { data, overflow, dtt } = this.props;
    const width = (node.width / 2) * data.z;
    const height = Math.max(20, node.height / 5) * data.z;

    const getWidth = parentWidth => inputWidth => {
      return parentWidth > inputWidth ? inputWidth : parentWidth;
    };

    const getLeft = (dorigin, containerWidth, z, overx, dttx) => inputWidth => {
      const center = containerWidth / 2;
      const halfInputWidth = inputWidth / 2;
      return dorigin + overx + center - halfInputWidth - dttx;
    };

    const inputStyle = {
      top: node.top + overflow.y + height + 12 - dtt.y,
      left: getLeft(node.left, node.width, data.z, overflow.x, dtt.x),
      z: data.z,
      width: getWidth(width),
      height
    };
    this.setState({ inputStyle });
  };

  handleNodeClick = e => {
    const { editable, editSelectedNode, onNodeClick, data, idx } = this.props;

    if (editable) {
      return editSelectedNode({
        x: data.x,
        y: data.y,
        idx: idx
      });
    }

    onNodeClick(data);
    // add selected state
    this.setState(prevState => ({ selected: !prevState.selected }));
  };

  handleDoubleClick = e => {
    e.stopPropagation();
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
      data,
      selectedClass,
      children,
      nodePanel,
      showPanel,
      showPanelIdx,
      idx,
      panelPosition
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
        onDoubleClick={this.handleDoubleClick}
        ref={node => (this.node = node)}
        id={`dag__node--${idx}`}
      >
        <circle />
        <text ref={node => (this.label = node)} className={classes.dagNodeText} />
        {data.x &&
          data.y &&
          newNode &&
          this.state.inputStyle &&
          children({
            outerEl,
            onTextChange: this.onTextChange,
            onKeyDown: this.onKeyDown,
            value: this.state.text,
            style: this.state.inputStyle
          })}
        {showPanel &&
          showPanelIdx === idx &&
          nodePanel &&
          nodePanel({ outerEl, data, actions: this.getActions(), ...panelPosition(data.x, data.y) })}
      </g>
    );
  }
}
