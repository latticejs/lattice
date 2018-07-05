import React, { Component } from 'react';

// Material-UI
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import ListItemText from '@material-ui/core/ListItemText';

// Apollo
import { compose, graphql } from 'react-apollo';

// @latticejs
import { List, ListItem } from '@latticejs/widgets';

// Ours
import AverageRevenue from '../components/dashboard/AverageRevenue';
import NewCustomers from '../components/dashboard/NewCustomers';
import Sales from '../components/dashboard/Sales';
import Stats from '../components/dashboard/Stats';
import TaskScheduler from '../components/dashboard/TaskScheduler';
import Demographic from '../components/dashboard/Demographic';

// Stores
import { tasksConnection } from '../stores/task';

class Dashboard extends Component {
  render() {
    const { lastCompletedTasks } = this.props;
    return (
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Grid container spacing={16}>
            <Grid item xs={6} lg={12}>
              <Paper>
                {lastCompletedTasks && (
                  <List
                    loadMore={() => {}}
                    list={lastCompletedTasks.edges.map(edge => edge.node)}
                    rowCount={lastCompletedTasks.totalCount}
                    rowHeight={68}
                    height={200}
                  >
                    {({ item, isEmpty, key, style }) => {
                      if (isEmpty) {
                        return <h4>Empty list</h4>;
                      }

                      if (!item) {
                        return (
                          <ListItem key={key} style={style}>
                            <ListItemText primary="loading..." />
                          </ListItem>
                        );
                      }

                      return (
                        <ListItem key={key} style={style}>
                          <ListItemText primary={item.title} />
                        </ListItem>
                      );
                    }}
                  </List>
                )}
              </Paper>
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
    props: ({ data: { tasksConnection } }) => ({
      lastCompletedTasks: tasksConnection
    }),
    options: props => ({
      variables: {
        orderBy: [{ field: 'completedAt', direction: 'asc' }],
        first: 10
      }
    })
  })
)(Dashboard);
