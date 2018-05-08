import { select, selectAll, mouse, event } from 'd3-selection';
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

export default class DagCore {

  static DEFAULTS = {
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

  static defaultState = {
  }

  constructor (root, initialState) {
    this.state = Object.assign(DagCore.defaultState, initialState);
    this.createGraph({ root, width: initialState.width, height: initialState.height });
  }

  createGraph ({ root, width, height }) {
    const thisGraph = this;

    this.svg = select(root)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // The <g> SVG element is a container used to group other SVG elements.
    this.svgG = this.svg.append('g')
      .classed(DagCore.DEFAULTS.graphClass, true)
      .attr('width', width)
      .attr('height', height)
      .attr('transform', 'translate(0,0)')

    // listen for dragging
    const dragSvg = zoom()
      .on('zoom', () => {
        if (event.sourceEvent.shiftKey){
          // TODO  the internal d3 state is still changing
          return false;
        } else {
          this.zoomed();
        }
        return true;
      })
      .on('start', function () {
        const ael = select(this).node();
        if (ael) ael.blur();

        select('body').style('cursor', 'move');
      })
      .on('end', function(){
        select('body').style('cursor', 'auto');
      });

    this.svg.call(dragSvg).on('dblclick.zoom', null);

    this.simulation = forceSimulation()
      .force("link", forceLink().id(function(d) {return d.title}))
      .force("collide",forceCollide( function(d){return 80 }) )
      .force("charge", forceManyBody())
      .force("center", forceCenter(width / 2, height / 2))
      .force("y", forceY(0))
      .force("x", forceX(0))

    this.link = this.svgG.append('g')
      .attr('class', DagCore.DEFAULTS.linkClass)
      .selectAll('line')
      .data(this.state.edges)
      .enter()
      .append('line')
      .attr('stroke', 'black')  // use theme

    this.nodes = this.svgG.append('g')
      .selectAll(`.${DagCore.DEFAULTS.nodeClass}`)
      .data(this.state.nodes)
      .enter()
      .append('g')
      .attr('class', DagCore.DEFAULTS.nodeClass)
      .append('circle')
      .attr('r', (d) => {  return 50 }) // d.r
      .call(drag()
        .on('start', (d) => this.dragstarted(d))
        .on('drag', this.dragged)
        .on('end', (d) => this.dragended(d)));

    selectAll(`.${DagCore.DEFAULTS.nodeClass}`).each(function (n){
      thisGraph.insertTitleLinebreaks(select(this), n.title)
    })

    this.simulation
      .nodes(this.state.nodes)
      .on('tick', this.updateGraph)

    this.simulation.force('link').links(this.state.edges);
  }

  updateGraph () {
    selectAll('line')
      .attr("x1", (d) => { return d.source.x; })
      .attr("y1", (d) => { return d.source.y; })
      .attr("x2", (d) => { return d.target.x; })
      .attr("y2", (d) => { return d.target.y; });

    selectAll(`.${DagCore.DEFAULTS.nodeClass}`)
      .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
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
    //d.fx = null;
    //d.fy = null;
  }

  insertTitleLinebreaks (gEl, title) {
    const words = title.split(/\s+/g);
    const nwords = words.length;

    const el = gEl.append('text')
      .attr('text-anchor','middle')
      .attr('dy', `-${(nwords-1)*7.5}`);

    words.map((word, idx) => {
      const tspan = el.append('tspan').text(word);
      if (idx > 0) tspan.attr('x', 0).attr('dy', '15');
    })
  }

  zoomed () {
    select(`.${DagCore.DEFAULTS.graphClass}`)
      .attr('transform', event.transform);
  }

  destroyGraph () {
    console.log('destroyGraph :: TBD')
    this.simulation.stop()
  }
}

