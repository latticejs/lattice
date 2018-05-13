import React, { Component } from 'react';
import classNames from 'classnames';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import DagCore, { DEFAULTS } from './dag';
import Node from './node';
import Edge from './edge';

const styles = theme => ({

  root: {
    color: theme.palette.text.secondary,
    padding: 16,
    fontFamily: theme.typography.fontFamily || 'roboto',
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
  }
});

export default class Dag extends Component {
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

    const { width, height, elevation=2, className, classes={}, style, children, ...others } = this.props;
    const rootClasses = [classes.root]

    if (classes.border) {
      rootClasses.push(classes.border, classes[`border-${border}`])
    }
    if (classes.featured) {
      rootClasses.push(classes.featured)
    }

    const nodes = this.props.nodes.map( (node,i) => {
      return (
        <Node
          data={node}
          name={node.title}
          key={`node-${i}`}
        />);
    });
    const edges = this.props.edges.map( (edge,i) => {
      return (
        <Edge
          key={edge.target+i}
          data={edge}
        />);
    });

    return (
      <Paper
        elevation={elevation}
        style={{ ...style, position: 'relative', cursor: 'default', width, height }}
        className={classNames('dag-wrapper', rootClasses)}
      >
        <svg
          ref={node => this.root = node}
          width={width}
          height={height}
        >
          <g className={DEFAULTS.graphClass}>
            <g>
              {edges}
            </g>
            <g>
              {nodes}
            </g>
          </g>
        </svg>
      </Paper>
    )
  }
}
