import { select, selectAll, event } from 'd3-selection';
import { drag } from 'd3-drag';
import { zoom } from 'd3-zoom';
import { forceSimulation, forceCollide, forceCenter, forceLink } from 'd3-force';

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

const createArrow = (arrow, line, nodeRadius) => {
  const triangleSize = 10;

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

  constructor(root, initialState) {
    this.state = {
      dragEnable: initialState.dragEnable || true,
      zoomEnable: initialState.zoomEnable || false,
      nodeRadius: initialState.nodeRadius
    };

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
      .force('charge', null)
      .force(
        'link',
        forceLink(edges).id(function(d) {
          return d.title;
        })
      )
      .force('collide', forceCollide(() => 80))
      .force('center', forceCenter(width / 2, height / 2));

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

    const nodeRadius = this.state.nodeRadius;
    // add arrow heads using a polygon
    selectAll('.dag__edge-arrow').each(function() {
      const line = this.parentNode.querySelector('line');
      createArrow(this, line, nodeRadius);
    });

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
