import React, { Component } from 'react';
import { Subscription, graphql, compose } from 'react-apollo';

// Material-UI
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

// Lattice

import { getPlatformInfo, cpuUpdated, memoryUpdated, psUpdated } from './stores/stat';
import CPUUsage from './components/CPUUsage';
import MemoryUsage from './components/MemoryUsage';
import ProcessUsage from './components/ProcessUsage';
import OSInfo from './components/OSInfo';
import CPUInfo from './components/CPUInfo';

// Custom Style
const styles = theme => ({
  widget: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 4
  },
  link: {
    color: theme.palette.text.secondary
  },
  title: {
    padding: 15
  },
  height400: {
    height: 400
  },
  height300: {
    height: 300
  }
});

class Dashboard extends Component {
  render() {
    const { classes, platformInfo } = this.props;

    return (
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={16}>
            <Grid item xs={8} className={classes.height400}>
              <Subscription subscription={cpuUpdated}>
                {({ data = {}, loading }) => <CPUUsage data={data.cpuUpdated} loading={loading} />}
              </Subscription>
            </Grid>
            <Grid item xs={4} className={classes.height400}>
              <Subscription subscription={psUpdated}>
                {({ data = {}, loading }) => <ProcessUsage data={data.psUpdated} loading={loading} />}
              </Subscription>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={16}>
            <Grid item xs={3} className={classes.height300}>
              <OSInfo data={platformInfo} />
            </Grid>
            <Grid item xs={3} className={classes.height300}>
              <CPUInfo data={platformInfo} />
            </Grid>
            <Grid item xs={3} className={classes.height300}>
              <Subscription subscription={memoryUpdated}>
                {({ data = {}, loading }) => <MemoryUsage data={data.memoryUpdated} loading={loading} />}
              </Subscription>
            </Grid>
            <Grid item xs={3} className={classes.height300}>
              <Paper>test</Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default compose(
  graphql(getPlatformInfo, {
    props: ({ data: { getPlatformInfo = {} } }) => ({
      platformInfo: getPlatformInfo
    })
  }),
  withStyles(styles)
)(Dashboard);
