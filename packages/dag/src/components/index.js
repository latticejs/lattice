/* eslint-disable no-unused-expressions */
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import MultilineIcon from '@material-ui/icons/Timeline';
import { makeStyles } from '@material-ui/core/styles';

import DagCore, { DEFAULTS } from './dag';
import Node from './node';
import Edge from './edge';
import GraphPanel from './panel';
const useStyles = makeStyles((theme) => {
  console.log({ backgroundColor: theme.palette.background.default });
  return {
    '@global': {
      span: {
        cursor: 'default',
        outline: 'none',
        caretColor: 'transparent',
      },
      aside: {
        cursor: 'default',
        outline: 'none',
        caretColor: 'transparent',
      },
      tspan: {
        cursor: 'default',
        outline: 'none',
        caretColor: 'transparent',
      },
    },
    root: {
      color: theme.palette.text.secondary,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize,
      cursor: 'pointer',
      caretColor: 'transparent',
      backgroundColor: theme.palette.background.default,
    },
    dagNode: {
      stroke: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.secondary.dark,
      fill: theme.palette.background.default,
      transition: 'stroke-width 0.3s ease-in',
      strokeWidth: 2,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
      cursor: 'pointer',
    },
    dagNodeText: {
      stroke: theme.palette.text.primary,
      fill: theme.palette.text.primary,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize,
      fontWeight: theme.typography.fontWeightLight,
    },
    dagEdge: {
      stroke: theme.palette.secondary[theme.palette.type],
      fill: theme.palette.secondary[theme.palette.type],
      transition: 'stroke-width 0.3s ease-in',
      strokeWidth: 2,
      cursor: 'pointer',
    },
    dagEditable: {
      '&:hover': {
        strokeWidth: 4,
      },
    },
    dagEdgeMarker: {
      fill: theme.palette.secondary[theme.palette.type],
      cursor: 'pointer',
    },
    dagEdgeGhost: {
      'stroke-dasharray': 5,
    },
  };
});

const SvgTextInput = React.memo(
  (props) => {
    let el = document.createElement('div');
    const [width, setWidth] = useState(50);
    const svginput = useRef(null);

    useLayoutEffect(() => {
      props.outerEl.appendChild(el);

      return () => {
        props.outerEl.removeChild(el);
      };
    }, []);

    useLayoutEffect(() => {
      if (svginput.current) svginput.current.focus();
      const { width } = svginput.current.getBoundingClientRect();
    }, [svginput.current]);

    const { style, onTextChange, onKeyDown } = props;

    return createPortal(
      <Input
        inputRef={svginput}
        type="text"
        autoFocus={true}
        placeholder="..."
        fullWidth={true}
        onChange={(e) => {
          onTextChange(e);
        }}
        onKeyDown={onKeyDown}
        style={{
          position: 'absolute',
          top: style.top,
          left: style.left(width),
          width: style.width(width),
          height: style.height,
          transform: `scale(${style.z})`,
          caretColor: 'initial',
        }}
      />,
      el
    );
  },
  () => {
    return true;
  }
);

// \\ default render method for edge actions \\
export const dagRenderEdgeActions = ({ deleteAction }) => {
  return (
    <IconButton>
      <DeleteIcon onClick={deleteAction} />
    </IconButton>
  );
};

// \\ default render method for edge actions \\
export const dagRenderNodeActions = ({ deleteAction, createEdgeAction }) => {
  return (
    <React.Fragment>
      <IconButton onClick={deleteAction}>
        <DeleteIcon />
      </IconButton>
      <IconButton onClick={createEdgeAction}>
        <MultilineIcon />
      </IconButton>
    </React.Fragment>
  );
};

const getNodeIdx = (node) => node.title;

export const Dag = (props) => {
  const styleClasses = useStyles();
  let g = useRef('');
  let root = useRef('');
  let graphContainer = useRef('');

  const [state, setState] = useState({
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
    gedges: JSON.parse(JSON.stringify(props.edges)),
  });
  let dagcore;

  // Note (dk): above gnodes and gedges are part of the state only to make things "easier" to understand.
  // These properties are owned by d3.

  const resetEditableState = (e) => {
    const { target } = e;
    const { editable } = props;
    const { enableEdgeCreation } = state;
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
      panelPosition: {},
    };

    if (!editable) return;

    if (enableEdgeCreation) {
      setState({
        ...state,
        ...reset,
      });
      return;
    }

    // user is clicking on root svg === outside node/edge component
    if (target !== root.current) return;

    if (state.newNodeReady) dagcore?.toggleDrag();

    setState({
      ...state,
      ...reset,
    });
  };
  let [distanceToTop, setDistanceToTop] = useState(null);

  useEffect(() => {
    const { width, height, nodeRadius, editable, zoomEnable, panEnable, dragEnable } = props;
    const params = {
      width,
      height,
      styleClasses,
      nodeRadius,
      zoomEnable: zoomEnable && !editable, // Note (dk): zoom mode and interactions like add a node are not compatible
      dragEnable,
      panEnable,
      nodes: [...state.gnodes],
      edges: [...state.gedges],
    };
    if (state.gnodes.length !== props.nodes.length || state.gedges.length !== props.edges.length) {
      const gnodes = JSON.parse(
        JSON.stringify(
          props.nodes.map((n, idx) => {
            const mergeNode = state.gnodes.find((gn) => gn.title === n.title);
            if (mergeNode) {
              // Note (dk): this is to maintain d3-managed elements positions
              return { ...n, ...mergeNode };
            }
            return n;
          })
        )
      );

      const gedges = JSON.parse(JSON.stringify(props.edges));
      setState({
        ...state,
        gnodes,
        gedges,
      });
    }
    dagcore = new DagCore(root.current, params, {
      getNodeIdx: props.getNodeIdx,
    });
    setDistanceToTop(getDTT(graphContainer.current));
  }, [
    props.width,
    props.height,
    props.nodeRadius,
    props.nodes,
    props.edges,
    props.getNodeIdx,
    props.editable,
    props.zoomEnable,
    props.panEnable,
    props.dragEnable,
    graphContainer,
    state.gnodes,
    state.gedges,
  ]);

  useEffect(() => {
    // NOTE (dk): gnodes and gedges are updated before render (getDerivedStateFromProps step)
    // eslint-disable-next-line no-unused-expressions
    dagcore?.restartGraph({ nodes: state.gnodes, edges: state.gedges });
  }, [state.gnodes, state.gedges]);

  const resetSelection = () => {
    return {
      newEdge: {},
      initNode: true,
    };
  };

  const resetNode = () => {
    return {
      newNodeReady: false,
      newNode: {},
    };
  };

  const getComputedTranslateXYZ = (g) => {
    const transArr = [];
    const obj = g.current;
    if (!window.getComputedStyle) return;
    let style = window.getComputedStyle(obj, null);
    let transform = style.transform || style.webkitTransform || style.mozTransform;

    if (!transform || transform === 'none') {
      // use another approach to get transform data
      const parseTransform = (attr) => {
        const b = {};
        for (let i in (attr = attr.match(/(\w+\((-?\d+\.?\d*e?-?\d*,?)+\))+/g))) {
          const c = attr[i].match(/[\w.-]+/g);
          b[c.shift()] = c;
        }
        return b;
      };

      const t = obj.getAttribute('transform');
      if (!t) return [0, 0, 1];
      const parsed = parseTransform(t);
      return [...parsed.translate.map((n) => Number(n)), ...parsed.scale.map((n) => Number(n))];
    } else {
      let mat = transform.match(/^matrix3d\((.+)\)$/);
      if (mat) return parseFloat(mat[1].split(', ')[13]);
      mat = transform.match(/^matrix\((.+)\)$/);
      transArr.push(mat ? parseFloat(mat[1].split(', ')[4]) : 0);
      transArr.push(mat ? parseFloat(mat[1].split(', ')[5]) : 0);
      transArr.push(mat ? parseFloat(mat[1].split(', ')[0]) : 1);
      return transArr;
    }
  };

  const getMousePosition = ({ svg, g }, clientX, clientY) => {
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const trans = getComputedTranslateXYZ(g);
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    const z = trans[2] || 1;
    const dx = trans[0] || 0;
    const dy = trans[1] || 0;
    return {
      x: (svgP.x - dx) / z,
      y: (svgP.y - dy) / z,
      z,
    };
  };

  // \\ onClickNode \\
  const editSelectedNode = (node) => {
    // Note (dk): editSelectedNode is called whenever the user click on a node.
    // Only when the graph is on editable mode. It is used to create new edges.
    let { newEdge, enableEdgeCreation, initNode, nodePanel } = state;
    const newEdgeKey = initNode ? 'source' : 'target';

    nodePanel = !enableEdgeCreation && initNode;

    // Note (dk): edgeInitialPoint represents the node coords of the first node
    // selected when the graph is on editable mode. This is useful for creating a
    // ghost edge between this node and the following selected by the user.
    let edgeInitialPoint = {
      x: node.x,
      y: node.y,
    };

    newEdge[newEdgeKey] = node.idx;
    // avoid self-directed nodes
    if (enableEdgeCreation && newEdge.source && newEdgeKey === 'target' && node.idx === newEdge.source) {
      setState({
        ...state,
        ...resetSelection(),
        edgeInitialPoint,
        nodePanelIdx: node.idx,
        nodePanel: !state.nodePanel,
      });
      return;
    }
    if (enableEdgeCreation && newEdgeKey === 'target') {
      // trigger new edge cb
      props.onEdgeAdded(newEdge);
      newEdge = {};
      edgeInitialPoint = {};
      enableEdgeCreation = false;
      initNode = true;
      nodePanel = false;
    }

    setState({
      ...state,
      newEdge,
      edgeInitialPoint,
      enableEdgeCreation,
      initNode,
      nodePanel,
      edgePanel: false,
      nodePanelIdx: node.idx,
    });
  };
  // \\ END onClickNode \\

  const editSelectedEdge = (edge) => {
    const trans = getComputedTranslateXYZ(g);
    const pos = {
      x: (edge.source.x + trans[0] + edge.target.x + trans[0]) / 2,
      y: (edge.source.y + trans[1] + edge.target.y + trans[1]) / 2,
    };
    setState({
      ...state,
      edgePanel: true,
      nodePanel: false,
      edgePanelIdx: edge.idx,
      panelPosition: pos,
    });
  };

  const newNode = (e) => {
    setState({
      ...state,
      newNodeReady: !state.newNodeReady,
      newNode: getMousePosition({ svg: root.current, g: g }, e.clientX, e.clientY),
    });
    dagcore?.toggleDrag();
  };

  const closeNode = () => {
    setState({ ...state, ...resetNode() });
    dagcore?.toggleDrag();
  };

  const setMousePosition = (e) => {
    setState({
      ...state,
      mouseMove: getMousePosition({ svg: root.current, g: g }, e.clientX, e.clientY),
    });
  };

  const renderGhostEdge = () => {
    // Note (dk): ghostEdge refers to an extra edge which appears
    // when you try to connect two nodes while in editable mode.
    const { editable } = props;

    const data = {
      source: {
        x: state.edgeInitialPoint.x,
        y: state.edgeInitialPoint.y,
      },
      target: {
        x: state.mouseMove.x,
        y: state.mouseMove.y,
      },
    };

    return <Edge data={data} classes={styleClasses} ghostEdge={true} editable={editable} />;
  };

  const renderEdgePanel = ({ source, target, actions }) => {
    return (
      <GraphPanel
        style={{
          position: 'absolute',
          top: state.panelPosition.y, // FIXME (dk): this applies only to edge's panel position. Rename it or
          left: state.panelPosition.x, // refactor and generalize.
        }}
        outerEl={graphContainer.current}
        source={props.getNodeIdx(source)}
        target={props.getNodeIdx(target)}
        actions={actions}
        closePanel={(e) => {
          e.stopPropagation();
          setState({ ...state, edgePanel: false });
        }}
      >
        {props.renderEdgeActions}
      </GraphPanel>
    );
  };

  const renderNodePanel = ({ data, x, y, actions }) => {
    return (
      <GraphPanel
        style={{
          position: 'absolute',
          top: y,
          left: x,
        }}
        outerEl={graphContainer.current}
        node={data}
        actions={actions}
        closePanel={(e) => {
          e.stopPropagation();
          setState({ ...state, nodePanel: false });
        }}
      >
        {props.renderNodeActions}
      </GraphPanel>
    );
  };

  // \\ GRAPH ACTIONS \\
  const deleteEdge = ({ event, idx }) => {
    event.stopPropagation();
    const { onEdgeRemoved, edges } = props;
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
    setState({ ...state, edgePanel: false });
  };

  const deleteNode = ({ event, idx }) => {
    event.stopPropagation();
    const { onNodeRemoved, nodes, edges } = props;
    const keyIdx = nodes.findIndex((n) => n.title === idx);
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
    const newEdges = tmpEdges.filter((e) => e.source !== idx && e.target !== idx);
    onNodeRemoved({ nodes: newNodes, edges: newEdges });

    // close panel
    setState({ ...state, nodePanel: false });
  };

  const createEdge = ({ event }) => {
    event.stopPropagation();
    setState({
      ...state,
      enableEdgeCreation: true,
      initNode: false,
      nodePanel: false,
    });
  };

  const getNodePanelPosition = (x, y) => {
    // Note (dk): this fn works for translating positions for nodes (and possibly edges)
    // there is no need to apply an extra transform like we do in getMousePosition
    // because the original points are svg points.
    const trans = getComputedTranslateXYZ(g);
    return {
      x: (x + trans[0]) / trans[2], // divide by trans[2] for scaling
      y: (y + trans[1]) / trans[2],
    };
  };

  // \\ END GRAPH ACTIONS \\

  const handleKeyUp = (e) => {
    e.stopPropagation();
    const { keyCode } = e;
    if (keyCode === 27) {
      resetEditableState(e);
    }
  };

  const getDTT = (el) => {
    let xPosition = 0;
    let yPosition = 0;

    while (el) {
      xPosition += el.offsetLeft - el.scrollLeft + el.clientLeft;
      yPosition += el.offsetTop - el.scrollTop + el.clientTop;
      el = el.offsetParent;
    }
    return { x: Math.abs(xPosition), y: Math.abs(yPosition) };
  };

  const {
    width,
    height,
    editable,
    onNodeClick,
    onEdgeClick,
    nodeRadius,
    selectedNodeClass,
    selectedEdgeClass,
    getNodeIdx,
  } = props;

  const rootClasses = [styleClasses.root];
  // NODES
  const nodes = state.gnodes.map((node, i) => {
    return (
      <Node
        idx={getNodeIdx(node)}
        key={`node-${getNodeIdx(node)}`}
        nodeRadius={nodeRadius}
        data={node}
        classes={styleClasses}
        selectedClass={selectedNodeClass}
        editSelectedNode={editSelectedNode}
        editable={editable}
        onNodeClick={onNodeClick}
        nodePanel={renderNodePanel}
        showPanel={state.nodePanel}
        showPanelIdx={state.nodePanelIdx}
        panelPosition={(x, y) => getNodePanelPosition(x, y)}
        deleteNode={({ event, idx }) => deleteNode({ event, idx })}
        createEdge={(event) => createEdge({ event })}
        getNodeIdx={getNodeIdx}
      />
    );
  });

  // EDGES
  const edges = state.gedges.map((edge, i) => {
    return (
      <Edge
        key={`dag__edge-${i}`}
        idx={i}
        data={edge}
        classes={styleClasses}
        editable={editable}
        onEdgeClick={onEdgeClick}
        editSelectedEdge={editSelectedEdge}
        showEdgePanel={state.edgePanel}
        showEdgePanelIdx={state.edgePanelIdx}
        selectedClass={selectedEdgeClass}
        deleteEdge={({ event, idx }) => deleteEdge({ event, idx })}
        getNodeIdx={getNodeIdx}
      >
        {(data) => renderEdgePanel(data)}
      </Edge>
    );
  });

  const overflow = {};
  overflow.x = window.scrollX || 0;
  overflow.y = window.scrollY || 0;
  return (
    <div
      ref={(container) => (graphContainer.current = container)}
      style={{
        position: 'relative',
        outline: 'none',
        caretColor: 'transparent',
      }}
      contentEditable={true}
      suppressContentEditableWarning={true}
      onKeyUp={handleKeyUp}
    >
      <svg
        ref={(node) => (root.current = node)}
        width={width}
        height={height}
        className={classNames('dag-wrapper', rootClasses)}
        onDoubleClick={editable ? newNode : () => {}}
        onMouseMove={editable && !state.newNodeReady ? setMousePosition : () => {}}
        onMouseUp={(e) => resetEditableState(e)}
      >
        <g ref={(node) => (g.current = node)} className={DEFAULTS.graphClass}>
          {edges}
          {nodes}
          {state.newNodeReady && (
            <Node
              key={Date.now()}
              idx={getNodeIdx({ title: 'new' })}
              dtt={distanceToTop}
              overflow={overflow}
              nodeRadius={nodeRadius}
              data={{ ...state.newNode }}
              classes={styleClasses}
              newNode={editable && state.newNodeReady}
              onNodeAdded={props.onNodeAdded}
              closeNode={closeNode}
              outerEl={graphContainer.current}
            >
              {(params) => {
                return <SvgTextInput {...params} />;
              }}
            </Node>
          )}
          {editable && state.enableEdgeCreation && state.edgeInitialPoint.x && renderGhostEdge()}
        </g>
      </svg>
    </div>
  );
};

export default Dag;
export const DAG_DEFAULTS = DEFAULTS;

Dag.defaultProps = {
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
  getNodeIdx,
};
