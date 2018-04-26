import { select, mouse, event } from 'd3-selection';
import { drag } from 'd3-drag';

export default class DagCore {

  static DEFAULTS = {
    selectedClass: "selected",
    connectClass: "connect-node",
    circleGClass: "conceptG",
    graphClass: "graph",
    activeEditId: "active-editing",
    BACKSPACE_KEY: 8,
    DELETE_KEY: 46,
    ENTER_KEY: 13,
    nodeRadius: 50
  }

  static defaultState = {
    selectedNode: null,
    selectedEdge: null,
    mouseDownNode: null,
    mouseDownLink: null,
    justDragged: false,
    justScaleTransGraph: false,
    lastKeyDown: -1,
    shiftNodeDrag: false,
    selectedText: null
  }

  constructor (root, initialState) {
    this.state = Object.assign(DagCore.defaultState, initialState);
    this.createGraph({ root, width:initialState.width, height: initialState.height });
  }

  createGraph ({ root, width, height }) {
    // define arrow markers for graph links
    this.svg = select(root)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const defs = this.svg.append('svg:defs');

    defs.append('svg:marker')
      .attr('id', 'end-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 32)
      .attr('markerWidth', 3.5)
      .attr('markerHeight', 3.5)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5');

    // define arrow markers for leading arrow
    defs.append('svg:marker')
      .attr('id', 'mark-end-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 7)
      .attr('markerWidth', 3.5)
      .attr('markerHeight', 3.5)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5');

    // The <g> SVG element is a container used to group other SVG elements.
    this.svgG = this.svg.append('g')
      .classed(DagCore.DEFAULTS.graphClass, true);

    // displayed when dragging between nodes

    this.dragLine = this.svgG.append('svg:path')
      .attr('class', 'link dragline hidden')
      .attr('d', 'M0,0L0,0')
      .style('marker-end', 'url(#mark-end-arrow)');

    this.drag = drag()
      .subject(d => ({x:d.x,y:d.y}))
      .on('start', () => event.subject.active = true)
      .on('drag', (args) => {
        console.log('draggin')
        this.state.justDragged = true;
        this.dragmove(event.subject, args);
      })
      .on('end', () => event.subject.active = false)

    // svg nodes and edges
    this.paths = this.svgG.append("g").selectAll("g");
    this.circles = this.svgG.append("g").selectAll("g");
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

  circleMouseDown (d3node, d) {

    event.stopPropagation();
    this.state.mouseDownNode = d;
    if (event.shiftKey){
      this.state.shiftNodeDrag = event.shiftKey;
      // reposition dragged directed edge
      this.dragLine.classed('hidden', false)
        .attr('d', `M${d.x},${d.y}L${d.x},${d.y}`);
      return;
    }
  }

  dragmove (target, coords) {

    if (this.state.shiftNodeDrag){
      this.dragLine.attr('d', `M${coords.x},${coords.y}L${mouse(this.svgG.node())[0]},${mouse(this.svgG.node())[1]}`);
    } else{
      coords.x += event.x;
      coords.y += event.y;
      updateGraph();
    }
  }

  dragGraph () {

    console.log('dragGraph')
    return drag()
      .subject(d => ({x:d.x,y:d.y}))
      .on('drag', (args) => {
        console.log('dragging')
        this.state.justDragged = true;
        dragmove(args);
      })
  }

  updateGraph () {

    const thisGraph = this;
    console.log('updateGraph')
    // mutating paths
    this.paths = this.paths.data(this.state.edges, (d) => {
      return `${d.source.id}+${d.target.id}`;
    });

    // update existing paths
    this.paths.style('marker-end', 'url(#end-arrow)')
      .classed(DagCore.DEFAULTS.selectedClass, d => d === this.state.selectedEdge)
      .attr('d', d => `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`);

    // add new paths
    this.paths.enter()
      .append('path')
      .style('marker-end','url(#end-arrow)')
      .classed('link', true)
      .attr('d', (d) => {
        return `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`;
      })
      .merge(this.paths)
      .on('mousedown', (d) => {
        console.log('mousedown', d)
        // thisGraph.pathMouseDown.call(thisGraph, d3.select(this), d);
      })
      .on('mouseup', (d) => {
        this.state.mouseDownLink = null;
      });

    // remove old links
    this.paths.exit().remove();

    // mutating existing nodes
    this.circles = this.circles.data(this.state.nodes, d => d.id);
    this.circles.attr('transform', d => `translate(${d.x},${d.y})`);

    // add new nodes
    const newGs = this.circles.enter().append('g').merge(this.circles);

    newGs.classed(DagCore.DEFAULTS.circleGClass, true)
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .on('mouseover', function (d) {
        if (thisGraph.state.shiftNodeDrag){
          select(this).classed(DagCore.DEFAULTS.connectClass, true);
        }
      })
      .on('mouseout', function (d) {
        select(this).classed(DagCore.DEFAULTS.connectClass, false);
      })
      .on('mousedown', function (d) {
        console.log('mousedown', d)
        //thisGraph.circleMouseDown(select(this), d);
      })
      .on('mouseup', function(d) {
        console.log('mouseup', d)
        // thisGraph.circleMouseUp.call(thisGraph, d3.select(this), d);
      })
      .call(this.dragGraph);

    newGs.append('circle')
      .attr('r', String(DagCore.DEFAULTS.nodeRadius));

    newGs.each(function (d) {
      thisGraph.insertTitleLinebreaks(select(this), d.title);
    });

    // remove old nodes
    this.circles.exit().remove();
  }

  destroyGraph () {
    console.log('destroyGraph :: TBD')

  }
}

