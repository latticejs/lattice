import React, { Component } from 'react';

// Material-UI
import Grid from '@material-ui/core/Grid';

// Apollo
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';

// @latticejs
import { Loader } from '@latticejs/widgets';

// Stores
import { getAllStats } from '../stores/stat';
import { getTopProductsSale } from '../stores/product';

// Ours
import AverageRevenue from '../components/dashboard/AverageRevenue';
import NewCustomers from '../components/dashboard/NewCustomers';
import TaskScheduler from '../components/dashboard/TaskScheduler';
import Demographic from '../components/dashboard/Demographic';
import Stats from '../components/dashboard/Stats';
import TopProducts from '../components/dashboard/TopProducts';

class Dashboard extends Component {
  getStats(stats, loadingStats) {
    const view = [];
    let counter = 0;

    for (const stat of stats) {
      view.push(
        <Loader key={`stat-${counter}`} loading={loadingStats}>
          <Grid item xs={6} lg={12 / stats.length}>
            <Stats stat={stat} />
          </Grid>
        </Loader>
      );
      counter++;
      // <Stats stat={stat}/>
    }

    return view;
  }
  //
  // {stats.map((stat, idx) => (
  //   <Grid key={`stat-${idx}`} item xs={6} lg={12 / stats.length}>
  //     <Stats stat={stat} />
  //   </Grid>
  // ))}

  render() {
    const { stats, loadingStats, topProducts, loadingTopProducts } = this.props;
    if (loadingStats || loadingTopProducts) {
      return null;
    }

    const statsView = this.getStats(stats, loadingStats);
    console.log(stats);
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {statsView}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Loader loading={loadingTopProducts}>
            <TopProducts data={topProducts} />
          </Loader>
        </Grid>
        <Grid item xs={12}>
          <Grid container alignItems="stretch" spacing={2}>
            <Grid item xs={12} md={8}>
              <NewCustomers style={{ height: '100%' }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <AverageRevenue />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container alignItems="stretch" spacing={2}>
            <Grid item xs={12} md={8}>
              <TaskScheduler />
            </Grid>
            <Grid item xs={12} md={4}>
              <Demographic style={{ height: '100%' }} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default compose(
  graphql(getAllStats, {
    props: ({ data: { getAllStats = [], loading } }) => ({
      stats: getAllStats,
      loadingStats: loading
    })
  }),
  graphql(getTopProductsSale, {
    props: ({ data: { getTopProductsSale = [], loading } }) => ({
      topProducts: getTopProductsSale,
      loadingTopProducts: loading
    }),
    options: {
      variables: {
        limit: 4
      }
    }
  })
)(Dashboard);
