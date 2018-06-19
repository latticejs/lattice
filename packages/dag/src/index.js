import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import Input from '@material-ui/core/Input';

import DagCore, { DEFAULTS } from './dag';
import Node from './node';
import Edge from './edge';

const styles = theme => ({
  root: {
    color: theme.palette.text.secondary,
    padding: 16,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize
  },
  dagNode: {
    stroke: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.secondary.dark,
    fill: theme.palette.background.default,
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    }
  },
  dagNodeText: {
    stroke: theme.palette.text.primary,
    fill: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    fontWeight: theme.typography.fontWeightLight
  },
  dagEdge: {
    stroke: theme.palette.secondary[theme.palette.type]
  },
  dagEdgeMarker: {
    fill: theme.palette.secondary[theme.palette.type]
  }
});

const SvgTextInput = props => {
  props.domNode = document.createElement('div');
  document.body.appendChild(props.domNode);
  return createPortal(
    <Input
      ref="input"
      type="text"
      autoFocus={true}
      placeholder="name..."
      value={props.value}
      onChange={props.onTextChange}
      onKeyDown={props.onKeyDown}
      style={{
        position: 'absolute',
        top: props.labelY,
        left: props.labelX,
        width: props.labelWidth,
        height: props.labelHeight
      }}
    />,
    props.domNode
  );
};

class Dag extends Component {
  static displayName = 'Dag';
  static defaultProps = {
    editable: false,
    onNodeAdded: () => {},
    onEdgeAdded: () => {}
  };

  constructor(...args) {
    super(...args);
    this.state = {
      newEdge: {},
      initNode: true,
      newNodeReady: false
    };
  }

  createGraph = ({ root, nodes, edges, width, height, classes }) => {
    this.dagcore = new DagCore(root, { nodes, edges, width, height, classes });
    this.dagcore.simulation.on('tick', this.dagcore.updateGraph);
  };

  componentDidMount() {
    this.createGraph({ root: this.root, ...this.props });
  }

  componentWillUnmount() {
    this.dagcore.destroyGraph();
  }

  resetSelection() {
    return {
      newEdge: {},
      initNode: true
    };
  }

  resetNode() {
    return {
      newNodeReady: false,
      newNode: {}
    };
  }

  editSelectedNode = node => {
    let { newEdge } = this.state;
    const newEdgeKey = this.state.initNode ? 'source' : 'target';
    // avoid self-directed nodes
    if (node === newEdge.source) {
      this.setState(this.resetSelection());
      return;
    }

    newEdge[newEdgeKey] = node;
    if (newEdgeKey === 'target') {
      // trigger new edge cb
      this.props.onEdgeAdded(newEdge);
      // reset state
      newEdge = {};
    }

    this.setState({
      initNode: !this.state.initNode,
      newEdge
    });
  };

  newNode = e => {
    this.setState({
      newNodeReady: !this.state.newNodeReady,
      newNode: {
        x: e.clientX,
        y: e.clientY
      }
    });
    this.dagcore.toggleDrag();
  };

  closeNode = () => {
    this.setState(this.resetNode());
    this.dagcore.toggleDrag();
  };

  render() {
    const { width, height, classes = {}, editable, onNodeClick, onEdgeClick } = this.props;
    const rootClasses = [classes.root];

    const nodes = this.props.nodes.map((node, i) => {
      return (
        <Node
          data={node}
          name={node.title}
          key={`node-${i}`}
          classes={classes}
          editSelectedNode={this.editSelectedNode}
          editable={editable}
          onNodeClick={onNodeClick}
        />
      );
    });

    const edges = this.props.edges.map((edge, i) => {
      return <Edge key={edge.target + i} data={edge} classes={classes} editable={editable} onEdgeClick={onEdgeClick} />;
    });

    return (
      <div style={{ position: 'relative' }}>
        <svg
          ref={node => (this.root = node)}
          width={width}
          height={height}
          className={classNames('dag-wrapper', rootClasses)}
          onDoubleClick={editable ? this.newNode : () => {}}
        >
          <g className={DEFAULTS.graphClass}>
            {edges}
            {nodes}
            {this.state.newNodeReady && (
              <Node
                data={{ id: undefined, x: this.state.newNode.x, y: this.state.newNode.y }}
                name={''}
                classes={this.props.classes}
                newNode={editable && this.state.newNodeReady}
                onNodeAdded={this.props.onNodeAdded}
                closeNode={this.closeNode}
              >
                {params => SvgTextInput(params)}
              </Node>
            )}
          </g>
        </svg>
      </div>
    );
  }
}

export default withStyles(styles, { name: 'Dag' })(Dag);
