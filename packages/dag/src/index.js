import React, { Component } from 'react';
import classNames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
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
  dagNode: {
    stroke: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.secondary.dark,
    fill: theme.palette.background.default,
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    }
  },
  dagNodeText: {
    stroke: theme.palette.text.primary,
    fill: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    fontWeight: theme.typography.fontWeightLight
  },
  dagEdge: {
    stroke: theme.palette.secondary[theme.palette.type]
  },
  dagEdgeMarker: {
    fill: theme.palette.secondary[theme.palette.type]
  }
});

class Dag extends Component {
  static displayName = 'Dag';

  state = {};

  componentDidMount() {
    this.dagcore = new DagCore(this.root, { ...this.props, ...this.state });
    this.dagcore.simulation.on('tick', this.dagcore.updateGraph);
  }

  componentWillUnmount() {
    this.dagcore.destroyGraph();
  }

  render() {
    const { width, height, classes = {} } = this.props;
    const rootClasses = [classes.root];

    const nodes = this.props.nodes.map((node, i) => {
      return <Node data={node} name={node.title} key={`node-${i}`} classes={classes} />;
    });
    const edges = this.props.edges.map((edge, i) => {
      return <Edge key={edge.target + i} data={edge} classes={classes} />;
    });

    return (
      <svg
        ref={node => (this.root = node)}
        width={width}
        height={height}
        className={classNames('dag-wrapper', rootClasses)}
      >
        <g className={DEFAULTS.graphClass}>
          {edges}
          {nodes}
        </g>
      </svg>
    );
  }
}

export default withStyles(styles, { name: 'Dag' })(Dag);
