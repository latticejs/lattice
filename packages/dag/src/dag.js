import { select, selectAll, event } from 'd3-selection';
import { drag } from 'd3-drag';
import { zoom } from 'd3-zoom';
import {
  forceSimulation,
  forceCollide,
  forceManyBody,
  forceCenter,
  forceY,
  forceX,
  forceLink
} from 'd3-force';

export const DEFAULTS = {
  selectedClass: "selected",
  linkClass: "connect-node",
  nodeClass: "node",
  graphClass: "graph",
  activeEditId: "active-editing",
  BACKSPACE_KEY: 8,
  DELETE_KEY: 46,
  ENTER_KEY: 13,
  nodeRadius: 50
}


export default class DagCore {

  static DEFAULTS = DEFAULTS;

  constructor (root, initialState) {
    this.createGraph({
      root,
      width: initialState.width,
      height: initialState.height,
      nodes: initialState.nodes,
      edges: initialState.edges
    });
  }

  createGraph ({ root, width, height, nodes, edges }) {

    select(root)
      .select(`.${DEFAULTS.graphClass}`)
      .attr('transform', 'translate(0,0)')

    this.svg = select(`.${DEFAULTS.graphClass}`)

    const dragSvg = zoom()
      .scaleExtent([1 / 2, 8])
      .on('zoom', () => {
        this.zoomed();
        return true;
      })
      .on('start', function () {
        select('body').style('cursor', 'move');
      })
      .on('end', function(){
        select('body').style('cursor', 'auto');
      });

    select(root).call(dragSvg)

    this.simulation = forceSimulation(nodes)
      .force('charge', forceManyBody().strength(-2000))
      .force('link', forceLink(edges).id(function(d) {return d.title}))
      .force('collide',forceCollide( function(d){return 80 }) )
      .force('center', forceCenter(width / 2, height / 2))
      .force('y', forceY(0))
      .force('x', forceX(0))

    selectAll(`.${DagCore.DEFAULTS.nodeClass}`)
      .call(drag()
        .on('start', (d) => this.dragstarted(d))
        .on('drag', this.dragged)
        .on('end', (d) => this.dragended(d)));

    this.simulation
      .on('tick', () => this.updateGraph())
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

  updateGraph(){
    selectAll('line')
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y);

    selectAll(`.${DagCore.DEFAULTS.nodeClass}`)
      .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
  }

  zoomed () {
   this.svg
      .attr('transform', event.transform);
  }

  destroyGraph () {
    this.simulation.stop()
  }
}

