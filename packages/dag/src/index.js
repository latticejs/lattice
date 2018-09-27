import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import MultilineIcon from '@material-ui/icons/Timeline';

import DagCore, { DEFAULTS } from './dag';
import Node from './node';
import Edge from './edge';
import GraphPanel from './panel';

const styles = theme => ({
  '@global': {
    span: {
      cursor: 'default',
      outline: 'none',
      caretColor: 'transparent'
    },
    aside: {
      cursor: 'default',
      outline: 'none',
      caretColor: 'transparent'
    },
    tspan: {
      cursor: 'default',
      outline: 'none',
      caretColor: 'transparent'
    }
  },
  root: {
    color: theme.palette.text.secondary,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    cursor: 'pointer'
  },
  dagNode: {
    stroke: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.secondary.dark,
    fill: theme.palette.background.default,
    transition: 'stroke-width 0.3s ease-in',
    strokeWidth: 2,
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    },
    cursor: 'pointer'
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
    fill: theme.palette.secondary[theme.palette.type],
    transition: 'stroke-width 0.3s ease-in',
    strokeWidth: 2,
    cursor: 'pointer'
  },
  dagEditable: {
    '&:hover': {
      strokeWidth: 4
    }
  },
  dagEdgeMarker: {
    fill: theme.palette.secondary[theme.palette.type],
    cursor: 'pointer'
  },
  dagEdgeGhost: {
    'stroke-dasharray': 5
  }
});

class SvgTextInput extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
    this.state = { width: 50 };
  }

  componentDidMount() {
    this.props.outerEl.appendChild(this.el);
    if (this.svginput) this.svginput.focus();

    const { width } = this.svginput.getBoundingClientRect();
    this.setState({
      width
    });
  }

  componentWillUnmount() {
    this.props.outerEl.removeChild(this.el);
  }

  render() {
    const { style } = this.props;
    return createPortal(
      <Input
        inputRef={svginput => (this.svginput = svginput)}
        type="text"
        autoFocus={true}
        placeholder="..."
        fullWidth={true}
        value={this.props.value}
        onChange={this.props.onTextChange}
        onKeyDown={this.props.onKeyDown}
        style={{
          position: 'absolute',
          top: style.top,
          left: style.left(this.state.width),
          width: style.width(this.state.width),
          height: style.height,
          transform: `scale(${style.z})`
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

// \\ default render method for edge actions \\
const dagRenderNodeActions = ({ deleteAction, createEdgeAction }) => (
  <React.Fragment>
    <IconButton onClick={deleteAction}>
      <DeleteIcon />
    </IconButton>
    <IconButton onClick={createEdgeAction}>
      <MultilineIcon />
    </IconButton>
  </React.Fragment>
);

const getNodeIdx = node => node.title;

class Dag extends Component {
  static displayName = 'Dag';
  static defaultProps = {
    nodeRadius: 50,
    dragEnable: true,
    panEnable: true,
    zoomEnable: false,
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
    renderEdgeActions: dagRenderEdgeActions,
    getNodeIdx
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
      panelPosition: {},
      gnodes: JSON.parse(JSON.stringify(props.nodes)),
      gedges: JSON.parse(JSON.stringify(props.edges))
    };
    // Note (dk): above gnodes and gedges are part of the state only to make things "easier" to understand.
    // These properties are owned by d3.
  }

  static getDerivedStateFromProps(props, state) {
    if (state.gnodes.length !== props.nodes.length || state.gedges.length !== props.edges.length) {
      const gnodes = JSON.parse(
        JSON.stringify(
          props.nodes.map((n, idx) => {
            const mergeNode = state.gnodes.find(gn => gn.title === n.title);
            if (mergeNode) {
              // Note (dk): this is to maintain d3-managed elements positions
              return { ...n, ...mergeNode };
            }
            return n;
          })
        )
      );

      const gedges = JSON.parse(JSON.stringify(props.edges));

      return {
        ...state,
        gnodes,
        gedges
      };
    }
    return null; // no changes
  }

  resetEditableState(e) {
    const { target } = e;
    const { editable } = this.props;
    const { enableEdgeCreation } = this.state;

    const reset = {
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

    if (!editable) return;

    if (enableEdgeCreation) {
      this.setState(reset);
      return;
    }

    // user is clicking on root svg === outside node/edge component
    if (target !== this.root) return;

    if (this.state.newNodeReady) this.dagcore.toggleDrag();

    this.setState(reset);
  }

  componentDidMount() {
    const { width, height, classes, nodeRadius, editable, zoomEnable, panEnable, dragEnable } = this.props;
    const params = {
      width,
      height,
      classes,
      nodeRadius,
      zoomEnable: zoomEnable && !editable, // Note (dk): zoom mode and interactions like add a node are not compatible
      dragEnable,
      panEnable,
      nodes: [...this.state.gnodes],
      edges: [...this.state.gedges]
    };
    this.dagcore = new DagCore(this.root, params, { getNodeIdx: this.props.getNodeIdx });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.nodes.length === this.props.nodes.length && prevProps.edges.length === this.props.edges.length) {
      return;
    }
    // NOTE (dk): gnodes and gedges are updated before render (getDerivedStateFromProps step)
    this.dagcore.restartGraph({ nodes: this.state.gnodes, edges: this.state.gedges });
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

  getComputedTranslateXYZ = obj => {
    const transArr = [];
    if (!window.getComputedStyle) return;
    const style = getComputedStyle(obj),
      transform = style.transform || style.webkitTransform || style.mozTransform;
    let mat = transform.match(/^matrix3d\((.+)\)$/);
    if (mat) return parseFloat(mat[1].split(', ')[13]);
    mat = transform.match(/^matrix\((.+)\)$/);
    transArr.push(mat ? parseFloat(mat[1].split(', ')[4]) : 0);
    transArr.push(mat ? parseFloat(mat[1].split(', ')[5]) : 0);
    transArr.push(mat ? parseFloat(mat[1].split(', ')[0]) : 1);
    return transArr;
  };

  getMousePosition = ({ svg, g }, clientX, clientY) => {
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const trans = this.getComputedTranslateXYZ(g);
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    const z = trans[2] || 1;
    const dx = trans[0] || 0;
    const dy = trans[1] || 0;
    return {
      x: (svgP.x - dx) / z,
      y: (svgP.y - dy) / z,
      z
    };
  };

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

    newEdge[newEdgeKey] = node.idx;
    // avoid self-directed nodes
    if (enableEdgeCreation && newEdge.source && newEdgeKey === 'target' && node.idx === newEdge.source) {
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
    const trans = this.getComputedTranslateXYZ(this.g);
    const pos = {
      x: (edge.source.x + trans[0] + edge.target.x + trans[0]) / 2,
      y: (edge.source.y + trans[1] + edge.target.y + trans[1]) / 2
    };
    this.setState({
      edgePanel: true,
      nodePanel: false,
      edgePanelIdx: edge.idx,
      panelPosition: pos
    });
  };

  newNode = e => {
    this.setState({
      newNodeReady: !this.state.newNodeReady,
      newNode: this.getMousePosition({ svg: this.root, g: this.g }, e.clientX, e.clientY)
    });
    this.dagcore.toggleDrag();
  };

  closeNode = () => {
    this.setState(this.resetNode());
    this.dagcore.toggleDrag();
  };

  setMousePosition = e => {
    this.setState({
      mouseMove: this.getMousePosition({ svg: this.root, g: this.g }, e.clientX, e.clientY)
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
          top: this.state.panelPosition.y, // FIXME (dk): this applies only to edge's panel position. Rename it or
          left: this.state.panelPosition.x // refactor and generalize.
        }}
        outerEl={this.graphContainer}
        source={this.props.getNodeIdx(source)}
        target={this.props.getNodeIdx(target)}
        actions={actions}
        closePanel={e => {
          e.stopPropagation();
          this.setState({ edgePanel: false });
        }}
      >
        {this.props.renderEdgeActions}
      </GraphPanel>
    );
  };

  renderNodePanel = ({ data, x, y, actions }) => {
    return (
      <GraphPanel
        style={{
          position: 'absolute',
          top: y,
          left: x
        }}
        outerEl={this.graphContainer}
        node={data}
        actions={actions}
        closePanel={e => {
          e.stopPropagation();
          this.setState({ nodePanel: false });
        }}
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
    const { onNodeRemoved, nodes, edges } = this.props;
    const keyIdx = nodes.findIndex(n => n.title === idx);
    let start = 0;
    let pivotA = 1;
    let pivotB = 1;
    let end = nodes.length;

    if (start === keyIdx) {
      start = pivotA;
    } else if (end === keyIdx) {
      end = keyIdx - 1;
    } else {
      pivotA = keyIdx;
      pivotB = pivotA + 1;
    }

    const tmpNodes = [...nodes];
    const tmpEdges = [...edges];
    const newNodes = tmpNodes.slice(start, pivotA).concat(tmpNodes.slice(pivotB, end));
    // also remove edges containing the node
    const newEdges = tmpEdges.filter(e => e.source !== idx && e.target !== idx);
    onNodeRemoved({ nodes: newNodes, edges: newEdges });

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

  getNodePanelPosition(x, y) {
    // Note (dk): this fn works for translating positions for nodes (and possibly edges)
    // there is no need to apply an extra transform like we do in getMousePosition
    // because the original points are svg points.
    const trans = this.getComputedTranslateXYZ(this.g);
    return {
      x: (x + trans[0]) / trans[2], // divide by trans[2] for scaling
      y: (y + trans[1]) / trans[2]
    };
  }

  // \\ END GRAPH ACTIONS \\

  handleKeyUp = e => {
    e.stopPropagation();
    const { keyCode } = e;
    if (keyCode === 27) {
      this.resetEditableState(e);
    }
  };

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
      selectedEdgeClass,
      getNodeIdx
    } = this.props;

    const rootClasses = [classes.root];
    // NODES
    const nodes = this.state.gnodes.map((node, i) => {
      return (
        <Node
          idx={getNodeIdx(node)}
          key={`node-${getNodeIdx(node)}`}
          nodeRadius={nodeRadius}
          data={node}
          classes={classes}
          selectedClass={selectedNodeClass}
          editSelectedNode={this.editSelectedNode}
          editable={editable}
          onNodeClick={onNodeClick}
          nodePanel={this.renderNodePanel}
          showPanel={this.state.nodePanel}
          showPanelIdx={this.state.nodePanelIdx}
          panelPosition={(x, y) => this.getNodePanelPosition(x, y)}
          deleteNode={({ event, idx }) => this.deleteNode({ event, idx })}
          createEdge={event => this.createEdge({ event })}
          getNodeIdx={getNodeIdx}
        />
      );
    });

    // EDGES
    const edges = this.state.gedges.map((edge, i) => {
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
          getNodeIdx={getNodeIdx}
        >
          {data => this.renderEdgePanel(data)}
        </Edge>
      );
    });

    return (
      <div
        ref={container => (this.graphContainer = container)}
        style={{ position: 'relative', outline: 'none' }}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onKeyUp={this.handleKeyUp}
      >
        <svg
          ref={node => (this.root = node)}
          width={width}
          height={height}
          className={classNames('dag-wrapper', rootClasses)}
          onDoubleClick={editable ? this.newNode : () => {}}
          onMouseMove={editable && !this.state.newNodeReady ? this.setMousePosition : () => {}}
          onMouseUp={e => this.resetEditableState(e)}
        >
          <g ref={node => (this.g = node)} className={DEFAULTS.graphClass}>
            {edges}
            {nodes}
            {this.state.newNodeReady && (
              <Node
                key={Date.now()}
                idx={getNodeIdx({ title: 'new' })}
                nodeRadius={nodeRadius}
                data={{ ...this.state.newNode }}
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
