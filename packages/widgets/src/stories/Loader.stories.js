import React from 'react';

import { Loader } from '../components';

import muiTheme from '../../.storybook/decorator-material-ui';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grow from '@material-ui/core/Grow';
import CircularProgress from '@material-ui/core/CircularProgress';
import purple from '@material-ui/core/colors/purple';

export default {
  title: 'Widgets/Loader',
  component: Loader,
};

const Loaded = () => (
  <Grid container alignItems="center" justify="center" style={{ height: '100vh' }}>
    <Grid item xs={2}>
      <Grow in={true} timeout={2000}>
        <Paper elevation={4} style={{ padding: 10 }}>
          <Typography variant="headline" component="h3">
            Loaded!
          </Typography>
        </Paper>
      </Grow>
    </Grid>
  </Grid>
);

const dynamicProps = () => ({
  loading: true,
  fullscreen: false,
});

const Template = (args) => {
  if (args.type === 'circular') {
    return (
      <Loader {...dynamicProps()}>
        <Loaded />
      </Loader>
    );
  }
  if (args.type === 'linear') {
    return (
      <Loader {...dynamicProps()} component="linear">
        <Loaded />
      </Loader>
    );
  }
  if (args.type === 'custom') {
    return (
      <Loader {...dynamicProps()} component={() => <CircularProgress style={{ color: purple[500] }} thickness={7} />}>
        <Loaded />
      </Loader>
    );
  }
};

export const Circular = Template.bind({});
Circular.decorators = [muiTheme()];
Circular.args = {
  type: 'circular',
};

export const Linear = Template.bind({});
Linear.args = {
  type: 'linear',
};

export const Custom = Template.bind({});
Custom.args = {
  type: 'custom',
};
