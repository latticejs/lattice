import React, { Component } from 'react';
import classNames from 'classnames';
import { select, mouse, event } from 'd3-selection';
import { drag } from 'd3-drag';

const style = {}

// *** D3 GRAPH LIB ** //

const DEFAULTS = {
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

const nodeCreator = () => {

}

const insertTitleLinebreaks = (gEl, title) => {
  var words = title.split(/\s+/g),
    nwords = words.length;
  var el = gEl.append("text")
    .attr("text-anchor","middle")
    .attr("dy", "-" + (nwords-1)*7.5);

  for (var i = 0; i < words.length; i++) {
    var tspan = el.append('tspan').text(words[i]);
    if (i > 0)
      tspan.attr('x', 0).attr('dy', '15');
  }
}

const createGraph = ({ svgEl }) => {
  // define arrow markers for graph links
  const svg = select(svgEl);
  const defs = svg.append('svg:defs');

  defs.append('svg:marker')
    .attr('id', 'end-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', "32")
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
  const svgG = svg.append('g')
    .classed(DEFAULTS.graphClass, true);

  svgG.append('svg:path')
    .attr('class', 'link dragline hidden')
    .attr('d', 'M0,0L0,0')
    .style('marker-end', 'url(#mark-end-arrow)');

  // svg nodes and edges
  const paths = svgG.append("g").selectAll("g");
  const circles = svgG.append("g").selectAll("g");

  return {
    d3svg: {
      svgEl,
      svg,
      svgG,
    },
    paths,
    circles
  }
}

const circleMouseDown = ({ d3svg, d3node, d, shiftNodeDrag }) => {

  event.stopPropagation();
  // mouseDownNode = d;
  if (event.shiftKey){
    shiftNodeDrag = event.shiftKey;
    // reposition dragged directed edge
    d3svg.svg.dragLine.classed('hidden', false)
      .attr('d', `M${d.x},${d.y}L${d.x},${d.y}`);
    return;
  }
};

const dragmove = ({ d3svg, paths, circles, edges, nodes, shiftNodeDrag, coords }) => {

  if (shiftNodeDrag){
    d3svg.svg.dragLine.attr('d', `M${coords.x},${coords.y}L${mouse(d3svg.svgG.node())[0]},${mouse(d3svg.svgG.node())[1]}`);
  } else{
    coords.x += event.dx;
    coords.y += event.dy;
    updateGraph({ d3svg, paths, circles, edges, nodes, shiftNodeDrag, justDragged });
  }
};


const dragGraph = ({ d3svg, paths, circles, edges, node, justDragged, shiftNodeDrag }) => {

  console.log('dragGraph')
  // Note (dk): import d3 behavior
  drag(d3svg.svgEl)
    .on('drag', (args) => {
      console.log('dragging')
      justDragged = true;
      dragmove({ d3svg, paths, circles, edges, nodes, shiftNodeDrag, args });
    })
}

const updateGraph = ({ d3svg, paths, circles, edges, nodes, selectedEdge, shiftNodeDrag, justDragged, mouseDownLink }) => {
  console.log('updateGraph')
  // mutating paths
  paths = paths.data(edges, (d) => {
    return `${d.source.id}+${d.target.id}`;
  });

  // update existing paths
  paths.style('marker-end', 'url(#end-arrow)')
    .classed(DEFAULTS.selectedClass, d => d === selectedEdge)
    .attr('d', d => `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`);

  // add new paths
  paths.enter()
    .append('path')
    .style('marker-end','url(#end-arrow)')
    .classed('link', true)
    .attr('d', (d) => {
      return `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`;
    })
    .on('mousedown', (d) => {
      console.log('mousedown', d)
      // thisGraph.pathMouseDown.call(thisGraph, d3.select(this), d);
    }
    )
    .on('mouseup', (d) => {
      mouseDownLink = null;
    });

  // remove old links
  paths.exit().remove();

  // mutating existing nodes
  circles = circles.data(nodes, d => d.id);
  circles.attr('transform', d => `translate(${d.x},${d.y})`);

  // add new nodes
  const newGs = circles.enter().append('g');

  newGs.classed(DEFAULTS.circleGClass, true)
    .attr('transform', d => `translate(${d.x},${d.y})`)
    .on('mouseover', (d) => {
      if (shiftNodeDrag){
        select(d3svg.svgEl).classed(DEFAULTS.connectClass, true);
      }
    })
    .on('mouseout', (d)  => {
      select(d3svg.svgEl).classed(DEFAULTS.connectClass, false);
    })
    .on('mousedown', function (d) {
      console.log('mousedown', d)
      circleMouseDown({ d3svg, d3node: select(this), d, shiftNodeDrag });
    })
    .on('mouseup', function(d){
      console.log('mouseup', d)
      // thisGraph.circleMouseUp.call(thisGraph, d3.select(this), d);
    })
    .call(() => {
      dragGraph({ d3svg, paths, circles, edges, nodes, justDragged, shiftNodeDrag })
    });

  newGs.append('circle')
    .attr('r', String(DEFAULTS.nodeRadius));

  newGs.each(function (d) {
    insertTitleLinebreaks(select(this), d.title);
  });


  // remove old nodes
  circles.exit().remove();
}

const destroyGraph = () => {

}

// *** D3 GRAPH LIB ** //

export default class Dag extends Component {
  static displayName = 'Dag'

  static defaultProps = {
    xLoc: 175,
    yLoc: 100,
    nodes: [
      {title: "new concept", id: 0, x: (175), y: 100},
      {title: "new concept", id: 1, x: (175), y: 300}
    ],
    edges: [{
      source: {title: "new concept", id: 1, x: (175), y: 100},
      target: {title: "new concept", id: 1, x: (175), y: 300}
    }],
    width: 500,
    height: 500
  }

  state = this.createDefaultState()

    
  createDefaultState () {
    return {
      defaultNodeTitle: 'demo',
      selectedNode: null,
      selectedEdge: null,
      mouseDownNode: null,
      mouseDownLink: null,
      justDragged: false,
      justScaleTransGraph: false,
      lastKeyDown: -1,
      shiftNodeDrag: true,
      selectedText: null
    }
  }

  componentDidMount () {
    console.log('componentDidMount')
    const {d3svg, paths, circles} = createGraph({ svgEl: this.node });
    this.d3svg = d3svg;
    this.paths = paths;
    this.circles = circles;
    updateGraph({
      svgEl: this.node,
      nodes: this.props.nodes,
      edges: this.props.edges,
      paths: this.paths,
      circles: this.circles,
      d3svg,
      ...this.state
    });
  }

  componentDidUpdate() {
    console.log('componentDidUpdate')
    updateGraph({
      svgEl: this.node,
      nodes: this.props.nodes,
      edges: this.props.edges,
      paths: this.paths,
      circles: this.circles,
      d3svg: this.d3svg,
      ...this.state
    });
  }

  componentWillUnmount () {
    console.log('componentWillUnmount')
    destroyGraph({ svg: this.node });
  }

  render () {

    const { width, height, className, style, children, ...others } = this.props;

    return (
      <div
        className={classNames('dag-wrapper', className)}
        style={{ ...style, position: 'relative', cursor: 'default', width, height }}
      >
        <svg ref={node => this.node = node}
          width={width}
          height={height}
        >
        </svg>
      </div>
    )
  }
}
