import React, { Component } from 'react';

// Material-UI
import Grid from '@material-ui/core/Grid';

// Apollo
import { compose, graphql } from 'react-apollo';

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
  render() {
    const { stats, loadingStats, topProducts, loadingTopProducts } = this.props;
    return (
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Grid container spacing={16}>
            <Loader loading={loadingStats}>
              {stats.map((stat, idx) => (
                <Grid key={`stat-${idx}`} item xs={6} lg={12 / stats.length}>
                  <Stats stat={stat} />
                </Grid>
              ))}
            </Loader>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Loader loading={loadingTopProducts}>
            <TopProducts data={topProducts} />
          </Loader>
        </Grid>
        <Grid item xs={12}>
          <Grid container alignItems="stretch" spacing={16}>
            <Grid item xs={12} md={8}>
              <NewCustomers style={{ height: '100%' }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <AverageRevenue />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container alignItems="stretch" spacing={16}>
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
