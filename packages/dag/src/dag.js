import { select, selectAll, event } from 'd3-selection';
import { drag } from 'd3-drag';
import { zoom } from 'd3-zoom';
import { forceSimulation, forceCollide, forceManyBody, forceCenter, forceY, forceX, forceLink } from 'd3-force';

export const DEFAULTS = {
  selectedClass: 'selected',
  linkClass: 'connect-node',
  nodeClass: 'node',
  graphClass: 'graph',
  activeEditId: 'active-editing',
  BACKSPACE_KEY: 8,
  DELETE_KEY: 46,
  ENTER_KEY: 13,
  nodeRadius: 50
};

export default class DagCore {
  static DEFAULTS = DEFAULTS;

  constructor(root, initialState) {
    this.state = {
      dragEnable: initialState.dragEnable || true,
      zoomEnable: initialState.zoomEnable || false
    };

    this.d3root = root;

    this.createGraph({
      root,
      width: initialState.width,
      height: initialState.height,
      nodes: initialState.nodes,
      edges: initialState.edges,
      theme: initialState.classes.dagEdgeMarker
    });
  }

  createGraph({ root, width, height, nodes, edges, theme }) {
    select(root)
      .append('svg:defs')
      .selectAll('marker')
      .data(['end'])
      .enter()
      .append('svg:marker') // This section adds in the arrows
      .attr('id', String)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 72) // refx distanche ~= node radius
      .attr('refY', 0)
      .attr('markerWidth', 8) //6
      .attr('markerHeight', 8) //6
      .attr('markerUnits', 'userSpaceOnUse')
      .attr('class', theme)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5');

    this.svg = select(`.${DEFAULTS.graphClass}`);

    this.simulation = forceSimulation(nodes)
      .force('charge', forceManyBody())
      .force(
        'link',
        forceLink(edges).id(function(d) {
          return d.title;
        })
      )
      .force(
        'collide',
        forceCollide(function(d) {
          return 80;
        })
      )
      .force('center', forceCenter(width / 2, height / 2))
      .force('y', forceY(0))
      .force('x', forceX(0));

    this.setZoomMode();
    this.setDragMode();

    this.simulation.on('tick', () => this.updateGraph());
  }

  dragstarted(d) {
    if (!event.active) this.simulation.alphaTarget(0.3).restart();
    d.fx = event.x;
    d.fy = event.y;
  }

  dragged(d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  dragended(d) {
    if (!event.active) this.simulation.alphaTarget(0);
  }

  updateGraph() {
    selectAll('line')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    selectAll(`.${DagCore.DEFAULTS.nodeClass}`).attr('transform', d => `translate(${d.x}, ${d.y})`);
  }

  zoomed() {
    this.svg.attr('transform', event.transform);
  }

  destroyGraph() {
    this.svg.selectAll('line').remove();
    this.svg.selectAll('g.node').remove();
    //this.simulation.stop();
  }

  nodes() {
    return selectAll(`.${DagCore.DEFAULTS.nodeClass}`);
  }

  edges() {
    return selectAll(`.${DagCore.DEFAULTS.linkClass}`);
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
        .on('drag', this.state.dragEnable ? this.dragged : () => {})
        .on('end', d => (this.state.dragEnable ? this.dragended(d) : () => {}))
    );
  }

  toggleDrag() {
    this.state.dragEnable = !this.state.dragEnable;
    this.setDragMode();
  }
}
