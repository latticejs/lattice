import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import MultilineIcon from '@material-ui/icons/Timeline';

import DagCore, { DEFAULTS } from './dag';
import Node from './node';
import Edge from './edge';
import GraphPanel from './panel';

const styles = theme => ({
  root: {
    color: theme.palette.text.secondary,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize
  },
  dagNode: {
    stroke: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.secondary.dark,
    fill: theme.palette.background.default,
    transition: 'stroke-width 0.3s ease-in',
    strokeWidth: 2,
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
    stroke: theme.palette.secondary[theme.palette.type],
    transition: 'stroke-width 0.3s ease-in',
    strokeWidth: 2
  },
  dagEditable: {
    '&:hover': {
      strokeWidth: 4
    }
  },
  dagEdgeMarker: {
    fill: theme.palette.secondary[theme.palette.type]
  },
  dagEdgeGhost: {
    'stroke-dasharray': 5
  }
});

class SvgTextInput extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    this.props.outerEl.appendChild(this.el);
    if (this.svginput) this.svginput.focus();
  }

  componentWillUnmount() {
    this.props.outerEl.removeChild(this.el);
  }

  render() {
    return createPortal(
      <Input
        inputRef={svginput => (this.svginput = svginput)}
        type="text"
        autoFocus={true}
        placeholder="name..."
        value={this.props.value}
        onChange={this.props.onTextChange}
        onKeyDown={this.props.onKeyDown}
        style={{
          position: 'absolute',
          top: this.props.labelY,
          left: this.props.labelX,
          width: this.props.labelWidth,
          height: this.props.labelHeight
        }}
      />,
      this.el
    );
  }
}

// \\ default render method for edge actions \\
const dagRenderEdgeActions = ({ deleteAction }) => (
  <IconButton>
    <DeleteIcon onClick={deleteAction} />
  </IconButton>
);

const dagRenderNodeActions = ({ deleteAction, createEdgeAction }) => (
  <React.Fragment>
    <IconButton>
      <DeleteIcon onClick={deleteAction} />
    </IconButton>
    <IconButton>
      <MultilineIcon onClick={createEdgeAction} />
    </IconButton>
  </React.Fragment>
);

class Dag extends Component {
  static displayName = 'Dag';
  static defaultProps = {
    nodeRadius: 50,
    editable: false,
    selectedEdgeClass: DEFAULTS.selectedEdgeClass,
    selectedNodeClass: DEFAULTS.selectedNodeClass,
    onNodeAdded: () => {},
    onEdgeAdded: () => {},
    onEdgeRemoved: () => {},
    onNodeRemoved: () => {},
    nodes: [],
    edges: [],
    renderNodeActions: dagRenderNodeActions,
    renderEdgeActions: dagRenderEdgeActions
  };

  constructor(props) {
    super(props);

    this.state = {
      newEdge: {},
      initNode: true,
      newNodeReady: false,
      enableEdgeCreation: false,
      edgeInitialPoint: {},
      mouseMove: {},
      edgePanel: false,
      nodePanel: false,
      nodePanelIdx: undefined,
      edgePanelIdx: undefined,
      panelPosition: {}
    };

    // deep copy nodes and edges, d3 will work with this.
    this.gnodes = JSON.parse(JSON.stringify(props.nodes));
    this.gedges = JSON.parse(JSON.stringify(props.edges));
  }

  resetEditableState(e) {
    const { target } = e;
    const { editable } = this.props;

    if (!editable) return;
    // user is clicking on root svg === outside node/edge component
    if (target !== this.root) return;

    if (this.state.newNodeReady) this.dagcore.toggleDrag();

    this.setState({
      newEdge: {},
      initNode: true,
      newNodeReady: false,
      enableEdgeCreation: false,
      edgeInitialPoint: {},
      mouseMove: {},
      edgePanel: false,
      nodePanel: false,
      nodePanelIdx: undefined,
      edgePanelIdx: undefined,
      panelPosition: {}
    });
  }

  componentDidMount() {
    const { width, height, classes, nodeRadius } = this.props;
    const params = Object.assign(
      {},
      { width, height, classes, nodeRadius },
      { nodes: this.gnodes },
      { edges: this.gedges }
    );
    this.dagcore = new DagCore(this.root, params);
  }

  componentWillUnmount() {
    this.dagcore.destroyGraph();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { editable } = this.props;
    const { enableEdgeCreation, nodePanel } = this.state;
    const { newNodeReady } = nextState;

    const newNodeReadyGoingOn = !this.state.newNodeReady && newNodeReady;
    const newNodeReadyGoingOff = !newNodeReadyGoingOn;

    // allow re-render when newNodeReady
    if (editable && newNodeReadyGoingOn) return true;

    // close newNodeReady element
    if (editable && newNodeReadyGoingOff) return true;

    // prevent re-render on mouseover
    if (editable && !enableEdgeCreation && !nodePanel) return false;

    return true;
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

  // \\ onClickNode \\
  editSelectedNode = node => {
    // Note (dk): editSelectedNode is called whenever the user click on a node.
    // Only when the graph is on editable mode. It is used to create new edges.
    let { newEdge, enableEdgeCreation, initNode, nodePanel } = this.state;
    const newEdgeKey = initNode ? 'source' : 'target';

    nodePanel = !enableEdgeCreation && initNode;

    // Note (dk): edgeInitialPoint represents the node coords of the first node
    // selected when the graph is on editable mode. This is useful for creating a
    // ghost edge between this node and the following selected by the user.
    let edgeInitialPoint = {
      x: node.x,
      y: node.y
    };

    newEdge[newEdgeKey] = node.title;
    // avoid self-directed nodes
    if (enableEdgeCreation && newEdge.source && newEdgeKey === 'target' && node.title === newEdge.source) {
      this.setState(
        Object.assign(
          this.resetSelection(),
          { edgeInitialPoint },
          { nodePanelIdx: node.idx },
          { nodePanel: !this.state.nodePanel }
        )
      );
      return;
    }
    if (enableEdgeCreation && newEdgeKey === 'target') {
      // trigger new edge cb
      this.props.onEdgeAdded(newEdge);
      // reset state
      newEdge = {};
      edgeInitialPoint = {};
      enableEdgeCreation = false;
      initNode = true;
      nodePanel = false;
    }

    this.setState({
      newEdge,
      edgeInitialPoint,
      enableEdgeCreation,
      initNode,
      nodePanel,
      edgePanel: false,
      nodePanelIdx: node.idx
    });
  };
  // \\ END onClickNode \\

  editSelectedEdge = edge => {
    this.setState({
      edgePanel: true,
      nodePanel: false,
      edgePanelIdx: edge.idx,
      panelPosition: {
        x: (edge.source.x + edge.target.x) / 2,
        y: (edge.source.y + edge.target.y) / 2
      }
    });
  };

  newNode = e => {
    this.setState(prevState => ({
      newNodeReady: !prevState.newNodeReady,
      newNode: {
        x: e.clientX,
        y: e.clientY
      }
    }));
    this.dagcore.toggleDrag();
  };

  closeNode = () => {
    this.setState(this.resetNode());
    this.dagcore.toggleDrag();
  };

  setMousePosition = e => {
    this.setState({
      mouseMove: {
        x: e.clientX,
        y: e.clientY
      }
    });
  };

  renderGhostEdge = () => {
    // Note (dk): ghostEdge refers to an extra edge which appears
    // when you try to connect two nodes while in editable mode.
    const { editable, classes } = this.props;

    const data = {
      source: {
        x: this.state.edgeInitialPoint.x,
        y: this.state.edgeInitialPoint.y
      },
      target: {
        x: this.state.mouseMove.x,
        y: this.state.mouseMove.y
      }
    };

    return <Edge data={data} classes={classes} ghostEdge={true} editable={editable} />;
  };

  renderEdgePanel = ({ source, target, actions }) => {
    return (
      <GraphPanel
        style={{
          position: 'absolute',
          top: this.state.panelPosition.y,
          left: this.state.panelPosition.x
        }}
        outerEl={this.graphContainer}
        source={source.title}
        target={target.title}
        actions={actions}
      >
        {this.props.renderEdgeActions}
      </GraphPanel>
    );
  };

  renderNodePanel = ({ title, x, y, actions }) => {
    return (
      <GraphPanel
        style={{
          position: 'absolute',
          top: y,
          left: x
        }}
        outerEl={this.graphContainer}
        title={title}
        actions={actions}
      >
        {this.props.renderNodeActions}
      </GraphPanel>
    );
  };

  // \\ GRAPH ACTIONS \\
  deleteEdge({ event, idx }) {
    event.stopPropagation();
    const { onEdgeRemoved, edges } = this.props;
    let start = 0;
    let pivotA = 1;
    let pivotB = 1;
    let end = edges.length;

    if (start === idx) {
      start = pivotA;
    } else if (end === idx) {
      end = idx - 1;
    } else {
      pivotA = idx;
      pivotB = pivotA + 1;
    }
    const newEdges = edges.slice(start, pivotA).concat(edges.slice(pivotB, end));

    onEdgeRemoved(newEdges);
    // close panel
    this.setState({
      edgePanel: false
    });
  }

  deleteNode({ event, idx }) {
    event.stopPropagation();
    const { onNodeRemoved, nodes } = this.props;
    let start = 0;
    let pivotA = 1;
    let pivotB = 1;
    let end = nodes.length;

    if (start === idx) {
      start = pivotA;
    } else if (end === idx) {
      end = idx - 1;
    } else {
      pivotA = idx;
      pivotB = pivotA + 1;
    }

    const newNodes = nodes.slice(start, pivotA).concat(nodes.slice(pivotB, end));
    onNodeRemoved(newNodes);
    // close panel
    this.setState({
      nodePanel: false
    });
  }

  createEdge({ event }) {
    event.stopPropagation();

    this.setState({
      enableEdgeCreation: true,
      initNode: false,
      nodePanel: false
    });
  }
  // \\ END GRAPH ACTIONS \\

  render() {
    const {
      width,
      height,
      classes = {},
      editable,
      onNodeClick,
      onEdgeClick,
      nodeRadius,
      selectedNodeClass,
      selectedEdgeClass
    } = this.props;

    const rootClasses = [classes.root];

    // NODES
    const nodes = this.gnodes.map((node, i) => {
      return (
        <Node
          idx={i}
          key={`node-${i}`}
          nodeRadius={nodeRadius}
          data={node}
          name={node.title}
          classes={classes}
          selectedClass={selectedNodeClass}
          editSelectedNode={this.editSelectedNode}
          editable={editable}
          onNodeClick={onNodeClick}
          nodePanel={this.renderNodePanel}
          showPanel={this.state.nodePanel}
          showPanelIdx={this.state.nodePanelIdx}
          deleteNode={({ event, idx }) => this.deleteNode({ event, idx })}
          createEdge={event => this.createEdge({ event })}
        />
      );
    });

    // EDGES
    const edges = this.gedges.map((edge, i) => {
      return (
        <Edge
          key={`dag__edge-${i}`}
          idx={i}
          data={edge}
          classes={classes}
          editable={editable}
          onEdgeClick={onEdgeClick}
          editSelectedEdge={this.editSelectedEdge}
          showEdgePanel={this.state.edgePanel}
          showEdgePanelIdx={this.state.edgePanelIdx}
          selectedClass={selectedEdgeClass}
          deleteEdge={({ event, idx }) => this.deleteEdge({ event, idx })}
        >
          {data => this.renderEdgePanel(data)}
        </Edge>
      );
    });

    return (
      <div ref={container => (this.graphContainer = container)} style={{ position: 'relative' }}>
        <svg
          ref={node => (this.root = node)}
          width={width}
          height={height}
          className={classNames('dag-wrapper', rootClasses)}
          onDoubleClick={editable ? this.newNode : () => {}}
          onMouseMove={editable && !this.state.newNodeReady ? this.setMousePosition : () => {}}
          onMouseUp={e => this.resetEditableState(e)}
        >
          <g className={DEFAULTS.graphClass}>
            {edges}
            {nodes}
            {this.state.newNodeReady && (
              <Node
                nodeRadius={nodeRadius}
                data={{ id: undefined, x: this.state.newNode.x, y: this.state.newNode.y }}
                name={''}
                classes={this.props.classes}
                newNode={editable && this.state.newNodeReady}
                onNodeAdded={this.props.onNodeAdded}
                closeNode={this.closeNode}
                outerEl={this.graphContainer}
              >
                {params => <SvgTextInput {...params} />}
              </Node>
            )}
            {editable && this.state.enableEdgeCreation && this.state.edgeInitialPoint.x && this.renderGhostEdge()}
          </g>
        </svg>
      </div>
    );
  }
}

export default withStyles(styles, { name: 'Dag' })(Dag);
export const DAG_DEFAULTS = DEFAULTS;
