import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';

// Material-UI
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

// @latticejs
import Dag from '@latticejs/dag';

// Store
import { getAllAreas } from '../stores/area';

class Areas extends Component {
  state = {
    nodes: [],
    edges: [],
    prevAreas: []
  };

  static getDerivedStateFromProps(props, state) {
    const { prevAreas } = state;
    const { loading, areas } = props;

    if (!loading && areas !== prevAreas) {
      return {
        prevAreas: areas,
        nodes: areas.map(area => ({ title: area.name })),
        edges: areas
          .map(area => {
            return area.dependsOn.map(dependArea => ({ source: area.name, target: dependArea.name }));
          })
          .reduce((result, next) => {
            // flatmap
            return result.concat(next);
          }, [])
      };
    }

    return null;
  }

  render() {
    const { loading } = this.props;
    const { nodes, edges } = this.state;

    return (
      <Grid container spacing={16}>
        {loading ? (
          <CircularProgress size={50} />
        ) : (
          <Dag editable nodes={nodes} edges={edges} width={1000} height={1000} />
        )}
      </Grid>
    );
  }
}

export default compose(
  graphql(getAllAreas, {
    props: ({ data: { getAllAreas, loading } }) => ({
      areas: getAllAreas,
      loading
    })
  })
)(Areas);
