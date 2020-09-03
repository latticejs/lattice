import React from 'react';
import { withKnobs, boolean } from '@storybook/addon-knobs';

// Material UI
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grow from '@material-ui/core/Grow';
import CircularProgress from '@material-ui/core/CircularProgress';
import purple from '@material-ui/core/colors/purple';

// Ours
import { Loader } from '../src';
import muiTheme from '../.storybook/decorator-material-ui';
import { JssDecorator } from './utils';
import Readme from '../README.md';
import { withReadme } from '@latticejs/storybook-readme';

// Decorators
const InGrid = (story) => (
  <Grid container>
    <Grid item xs={12}>
      {story()}
    </Grid>
  </Grid>
);

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
  loading: boolean('LOADING', true),
  fullscreen: boolean('FULLSCREEN', false),
});

const withApiReadme = withReadme(Readme)(['loader-api']);

export default ({ storiesOf }) => {
  storiesOf('widgets/Loader', module)
    .addDecorator(withKnobs)
    .addDecorator(JssDecorator)
    .addDecorator(InGrid)
    .addDecorator(muiTheme())
    .add(
      'circular',
      withApiReadme(() => (
        <Loader {...dynamicProps()}>
          <Loaded />
        </Loader>
      ))
    )
    .add(
      'linear',
      withApiReadme(() => (
        <Loader {...dynamicProps()} component="linear">
          <Loaded />
        </Loader>
      ))
    )
    .add(
      'custom',
      withApiReadme(() => (
        <Loader {...dynamicProps()} component={() => <CircularProgress style={{ color: purple[500] }} thickness={7} />}>
          <Loaded />
        </Loader>
      ))
    );
};
