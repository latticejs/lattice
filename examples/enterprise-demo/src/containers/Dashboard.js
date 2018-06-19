import React, { Component } from 'react';

// Material-UI
import Grid from '@material-ui/core/Grid';

// Apollo
import { compose, graphql } from 'react-apollo';

// Ours
import AverageRevenue from '../components/dashboard/AverageRevenue';
import NewCustomers from '../components/dashboard/NewCustomers';
import Sales from '../components/dashboard/Sales';
import Stats from '../components/dashboard/Stats';
import TaskScheduler from '../components/dashboard/TaskScheduler';
import Demographic from '../components/dashboard/Demographic';
import allSales from '../queries/sales';
import allStats from '../queries/stats';

class Dashboard extends Component {
  render() {
    const { sales = [], stats = [] } = this.props;
    return (
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Grid container spacing={16}>
            {stats.map((stat, idx) => (
              <Grid key={`stat-${idx}`} item xs={6} lg={12 / stats.length}>
                <Stats stat={stat} />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Sales data={sales} />
            </Grid>
          </Grid>
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
  graphql(allSales, { props: ({ data: { allSales } }) => ({ sales: allSales }) }),
  graphql(allStats, { props: ({ data: { allStats } }) => ({ stats: allStats }) })
)(Dashboard);
