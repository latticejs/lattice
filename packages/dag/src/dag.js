import { select, selectAll, event } from 'd3-selection';
import { drag } from 'd3-drag';
import { zoom } from 'd3-zoom';
import { forceSimulation, forceCollide, forceCenter, forceLink, forceManyBody, forceX, forceY } from 'd3-force';

export const DEFAULTS = {
  selectedNodeClass: 'dag__node-selected',
  selectedEdgeClass: 'dag__edge-selected',
  linkClass: 'dag__edge',
  nodeClass: 'dag__node',
  graphClass: 'dag__graph',
  arrowClass: 'dag__edge-arrow',
  BACKSPACE_KEY: 8,
  DELETE_KEY: 46,
  ENTER_KEY: 13,
  nodeRadius: 50
};

const updateArrow = (arrow, line, nodeRadius) => {
  const triangleSize = 10;
  if (typeof line.getPointAtLength !== 'function') return;

  const totalLength = line.getTotalLength() - (nodeRadius + 11.5); // yes, 11.5 is a magic number
  const startPoint = line.getPointAtLength(totalLength - triangleSize);
  const endPoint = line.getPointAtLength(totalLength);

  const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
  const angleDeg = (angle * 180) / Math.PI;

  const pointOnCircle = (p, a, d) => {
    const newAngle = ((a + d) * Math.PI) / 180;
    return p.x + Math.cos(newAngle) * triangleSize + ',' + (p.y + Math.sin(newAngle) * triangleSize);
  };

  const p1 = pointOnCircle(endPoint, angleDeg, 0);
  const p2 = pointOnCircle(endPoint, angleDeg, 135);
  const p3 = pointOnCircle(endPoint, angleDeg, -135);
  arrow.setAttribute('points', `${p1} ${p2} ${p3}`);
};

export default class DagCore {
  static DEFAULTS = DEFAULTS;

  constructor(root, initialState, props = {}) {
    // root represents the svg element. It is required.
    this.state = {
      dragEnable: initialState.dragEnable || true,
      zoomEnable: initialState.zoomEnable || false,
      nodeRadius: initialState.nodeRadius,
      height: initialState.height,
      width: initialState.width,
      nodes: initialState.nodes,
      edges: initialState.edges
    };

    this.props = props;

    this.d3root = root;

    this.createGraph({
      root,
      width: initialState.width,
      height: initialState.height,
      nodes: initialState.nodes,
      edges: initialState.edges,
      theme: initialState.classes.dagEdgeMarker,
      nodeRadius: initialState.nodeRadius
    });
  }

  createGraph({ root, width, height, nodes, edges, theme, nodeRadius }) {
    select(root)
      .attr('class', theme)
      .attr('orient', 'auto');

    this.svg = select(`.${DEFAULTS.graphClass}`);
    this.simulation = forceSimulation(nodes)
      .force(
        'charge',
        forceManyBody()
          .strength(`-${nodeRadius}`)
          .distanceMax(0)
      )
      .force(
        'link',
        forceLink(edges)
          .id(this.props.getNodeIdx)
          .distance(nodeRadius)
          .strength(1)
      )
      .force(
        'collide',
        forceCollide()
          .radius(nodeRadius * 1.4)
          .strength(1)
      )
      .force('center', forceCenter(width / 2, height / 2))
      .force('forceX', forceX(10))
      .force('forceY', forceY(10));

    this.setZoomMode();
    this.setDragMode();
    this.cacheLines();
    this.simulation.on('tick', () => this.updateGraph());
    // Note (dk): here we are doing some custom and limited iterations
    // to the graph. The graph iterates calling the tick fn every 300ms or so.
    // Here we are avoiding doing that and we are manually limiting iterations.
    // The final effect is to show a "static" graph instead of a one which is always
    // moving. The effect is noticed when the graph is mounted (on creation)
    const iterations = Math.pow(16, 2); // 16 === magic number
    for (let i = iterations; i > 0; --i) this.simulation.tick();
  }
  // \\ drag functions \\
  dragstarted(d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  dragged(d) {
    this.simulation.alphaTarget(0).restart();
    d.fx = event.x;
    d.fy = event.y;
  }

  dragended(d) {
    if (!event.active) this.simulation.alphaTarget(0);
  }
  // \\ END drag functions \\

  cacheLines() {
    const that = this;
    that.linesCache = [];
    //if (this.linesCache.length > 0) return;
    selectAll(`.${DEFAULTS.arrowClass}`).each(function() {
      if (!that.linesCache[this.id]) {
        that.linesCache[this.id] = this.parentNode.querySelector('line');
      }
    });
  }

  restartGraph({ nodes, edges }) {
    this.state.nodes = nodes;
    this.state.edges = edges;

    this.simulation = forceSimulation(nodes)
      .force(
        'charge',
        forceManyBody()
          .strength(`-${this.state.nodeRadius}`)
          .distanceMax(0)
      )
      .force(
        'link',
        forceLink(edges)
          .id(this.props.getNodeIdx)
          .distance(this.state.nodeRadius)
          .strength(1)
      )
      .force(
        'collide',
        forceCollide()
          .radius(this.state.nodeRadius * 1.4)
          .strength(1)
      )
      .force('center', forceCenter(this.state.width / 2, this.state.height / 2));

    this.setDragMode();
    this.setZoomMode();

    this.cacheLines();
    this.simulation.on('tick', () => this.updateGraph());
    const iterations = Math.pow(16, 2); // 16 === magic number
    for (let i = iterations; i > 0; --i) this.simulation.tick();
  }

  updateGraph() {
    const { nodeRadius } = this.state;
    const that = this;
    // move lines
    selectAll('line')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    // add arrow heads using a polygon
    selectAll(`.${DEFAULTS.arrowClass}`).each(function() {
      if (that.linesCache[this.id]) {
        updateArrow(this, that.linesCache[this.id], nodeRadius);
      }
    });

    // move nodes
    selectAll(`.${DagCore.DEFAULTS.nodeClass}`).attr('transform', d => {
      d.fx = d.x;
      d.fy = d.y;
      return `translate(${d.x}, ${d.y})`;
    });
  }

  zoomed() {
    this.svg.attr('transform', event.transform);
  }

  destroyGraph() {
    this.simulation.stop();
  }

  nodes() {
    return selectAll(`.${DagCore.DEFAULTS.nodeClass}`);
  }

  edges() {
    return selectAll(`line`);
  }

  graph() {
    return select(`.${DagCore.DEFAULTS.graphClass}`);
  }

  setZoomMode() {
    const zoomGraph = zoom()
      .scaleExtent([1 / 2, 8])
      .on('zoom', () => {
        if (this.state.dragEnable) {
          this.zoomed();
        }
        return true;
      })
      .on('start', function() {
        select('body').style('cursor', 'move');
      })
      .on('end', function() {
        select('body').style('cursor', 'auto');
      });

    select(this.d3root)
      .call(this.state.zoomEnable ? zoomGraph : () => {})
      .on('dblclick.zoom', null); // disable zoom on double click
  }

  setDragMode() {
    selectAll(`.${DagCore.DEFAULTS.nodeClass}`).call(
      drag()
        .on('start', d => (this.state.dragEnable ? this.dragstarted(d) : () => {}))
        .on('drag', d => (this.state.dragEnable ? this.dragged(d) : () => {}))
        .on('end', d => (this.state.dragEnable ? this.dragended(d) : () => {}))
    );
  }

  toggleDrag() {
    this.state.dragEnable = !this.state.dragEnable;
    this.setDragMode();
  }
}
