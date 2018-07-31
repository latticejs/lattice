import React, { Component } from 'react';

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

// Decorators

const InGrid = story => (
  <Grid container>
    <Grid item xs={12}>
      {story()}
    </Grid>
  </Grid>
);

class LazyData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ loading: false });
    }, 3000);
  }

  render() {
    return this.props.children({ loading: this.state.loading });
  }
}

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

export default ({ storiesOf, action }) => {
  storiesOf('widgets/Loader', module)
    .addDecorator(JssDecorator)
    .addDecorator(InGrid)
    .addDecorator(muiTheme())
    .add('linear', () => (
      <LazyData>
        {({ loading }) => (
          <Loader loading={loading}>
            <Loaded />
          </Loader>
        )}
      </LazyData>
    ))
    .add('circular', () => (
      <LazyData>
        {({ loading }) => (
          <Loader loading={loading} component="circular">
            <Loaded />
          </Loader>
        )}
      </LazyData>
    ))
    .add('custom', () => (
      <LazyData>
        {({ loading }) => (
          <Loader loading={loading} component={() => <CircularProgress style={{ color: purple[500] }} thickness={7} />}>
            <Loaded />
          </Loader>
        )}
      </LazyData>
    ));
};
