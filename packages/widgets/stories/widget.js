import React from 'react';

// Material UI
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

// Ours
import { Widget } from '../src';
import muiTheme from '../.storybook/decorator-material-ui';
import { JssDecorator } from './utils';
import Readme from '../README.md';
import { withReadme } from '@latticejs/storybook-readme';

// Decorators

const InGrid = story => (
  <Grid container spacing={24}>
    <Grid item xs={12}>
      {story()}
    </Grid>
  </Grid>
);

const Flexed = story => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>{story()}</div>
);
const FullViewport = story => <div style={{ height: '100vh', width: '100vw', padding: 12 }}>{story()}</div>;

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum. A pellentesque sit amet porttitor eget. Aenean sed adipiscing diam donec adipiscing tristique risus.`;

const withApiReadme = withReadme(Readme)(['widget-api']);

export default ({ storiesOf }) => {
  storiesOf('widgets/Widget', module)
    .addDecorator(JssDecorator)
    .addDecorator(InGrid)
    .addDecorator(Flexed)
    .addDecorator(muiTheme())
    .addDecorator(FullViewport)
    .add('basic', withApiReadme(() => <Widget title="Title">{lorem}</Widget>))
    .add(
      'featured',
      withApiReadme(() => (
        <Widget featured title="Title">
          {lorem}
        </Widget>
      ))
    )
    .add(
      'with borders',
      withApiReadme(({ classes }) => (
        <Styled>
          {classes => (
            <Grid container spacing={24}>
              <Grid item xs={6}>
                <Widget title="Border top" border="top">
                  {lorem}
                </Widget>
              </Grid>
              <Grid item xs={6}>
                <Widget title="Border bottom" border="bottom">
                  {lorem}
                </Widget>
              </Grid>
              <Grid item xs={6}>
                <Widget title="Border top custom" border="top" classes={{ border: classes.customTopBorder }}>
                  {lorem}
                </Widget>
              </Grid>
              <Grid item xs={6}>
                <Widget title="Border bottom custom" border="bottom" classes={{ border: classes.customBotomBorder }}>
                  {lorem}
                </Widget>
              </Grid>
            </Grid>
          )}
        </Styled>
      ))
    );

  storiesOf('widgets/Widget (dark theme)', module)
    .addDecorator(JssDecorator)
    .addDecorator(InGrid)
    .addDecorator(Flexed)
    .addDecorator(muiTheme({ palette: { type: 'dark' } }))
    .addDecorator(FullViewport)
    .add('basic', withApiReadme(() => <Widget title="Title">{lorem}</Widget>))
    .add(
      'featured',
      withApiReadme(() => (
        <Widget featured title="Title">
          {lorem}
        </Widget>
      ))
    )
    .add(
      'with borders',
      withApiReadme(({ classes }) => (
        <Styled>
          {classes => (
            <Grid container spacing={24}>
              <Grid item xs={6}>
                <Widget title="Border top" border="top">
                  {lorem}
                </Widget>
              </Grid>
              <Grid item xs={6}>
                <Widget title="Border bottom" border="bottom">
                  {lorem}
                </Widget>
              </Grid>
              <Grid item xs={6}>
                <Widget title="Border top custom" border="top" classes={{ border: classes.customTopBorder }}>
                  {lorem}
                </Widget>
              </Grid>
              <Grid item xs={6}>
                <Widget title="Border bottom custom" border="bottom" classes={{ border: classes.customBotomBorder }}>
                  {lorem}
                </Widget>
              </Grid>
            </Grid>
          )}
        </Styled>
      ))
    );
};

const styles = theme => ({
  customTopBorder: {
    borderColor: 'red'
  },
  customBotomBorder: {
    borderWidth: 2,
    borderColor: 'green'
  }
});

const Styled = withStyles(styles)(({ classes, children }) => {
  return children(classes);
});
