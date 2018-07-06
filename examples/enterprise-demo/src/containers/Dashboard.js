import React, { Component } from 'react';

// Material-UI
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

// Apollo
import { compose, graphql } from 'react-apollo';

// Ours
import AverageRevenue from '../components/dashboard/AverageRevenue';
import NewCustomers from '../components/dashboard/NewCustomers';
import Tasks from '../components/dashboard/Tasks';
import TaskScheduler from '../components/dashboard/TaskScheduler';
import Demographic from '../components/dashboard/Demographic';

// Stores
import { tasksConnection } from '../stores/task';

class Dashboard extends Component {
  render() {
    const { completedTasks } = this.props;
    return (
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Grid container spacing={16}>
            <Grid item xs={6} lg={12}>
              <Tasks {...completedTasks} title="Completed Tasks" />
            </Grid>
            <Grid item xs={12} />
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
  graphql(tasksConnection, {
    props: ({ data: { tasksConnection, loading, fetchMore } }) => ({
      completedTasks: {
        tasks: tasksConnection,
        loading,
        fetchMore
      }
    }),
    options: props => ({
      variables: {
        filterBy: [{ field: 'completedAt', value: null, operator: 'NOT_EQUAL' }],
        orderBy: [{ field: 'completedAt', direction: 'asc' }],
        first: 10
      }
    })
  })
)(Dashboard);
