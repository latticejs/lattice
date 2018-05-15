import React, { Component } from 'react';
import classNames from 'classnames';
import Paper from 'material-ui/Paper';
import withStyles from 'material-ui/styles/withStyles';
import DagCore, { DEFAULTS } from './dag';
import Node from './node';
import Edge from './edge';

const styles = theme => ({

  root: {
    color: theme.palette.text.secondary,
    padding: 16,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize
  },
  border: {
    borderColor: theme.palette.primary.main,
    borderWidth: 4
  },
  'border-top': {
    borderTopStyle: 'solid'
  },
  'border-bottom':{
    borderBottomStyle: 'solid'
  },
  featured: {
    backgroundColor: theme.palette.primary.main,
    color:theme.palette.getContrastText(theme.palette.primary.main)
  },
  dagNode: {
    stroke: theme.palette.primary.main,
    fill: theme.palette.getContrastText(theme.palette.primary.main),
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    }
  },
  dagNodeText: {
    stroke: theme.palette.text.secondary,
    fill: theme.palette.text.secondary,
  },
  dagEdge: {
    stroke: theme.palette.grey['500'],
  },
  dagEdgeMarker: {
    fill: theme.palette.grey['500']
  }
});

 class Dag extends Component {
  static displayName = 'Dag'

  state = {}

  componentDidMount () {

    this.dagcore = new DagCore(this.root, { ...this.props, ...this.state })
    this.dagcore.simulation.on('tick', this.dagcore.updateGraph)
  }

  componentWillUnmount () {
    this.dagcore.destroyGraph();
  }

  render () {

    const { title, width, height, elevation=2, className, classes={}, style, theme, border, featured, ...others } = this.props;
    const rootClasses = [classes.root]

    if (border) {
      rootClasses.push(classes.border, classes[`border-${border}`])
    }
    if (featured) {
      rootClasses.push(featured)
    }

    const nodes = this.props.nodes.map( (node,i) => {
      return (
        <Node
          data={node}
          name={node.title}
          key={`node-${i}`}
          classes={classes}
        />);
    });
    const edges = this.props.edges.map( (edge,i) => {
      return (
        <Edge
          key={edge.target+i}
          data={edge}
          classes={classes}
        />);
    });

    return (
      <Paper
        elevation={elevation}
        style={{ ...style, position: 'relative', cursor: 'default', width, height }}
        className={classNames('dag-wrapper', rootClasses)}
      >
        {title && <Typography variant="title" color="inherit" gutterBottom>{title}</Typography>}
        <svg
          ref={node => this.root = node}
          width={width}
          height={height}
        >
          <g className={DEFAULTS.graphClass}>
            {edges}
            {nodes}
          </g>
        </svg>
      </Paper>
    )
  }
}

export default withStyles(styles, { name: 'Dag' })(Dag) 
