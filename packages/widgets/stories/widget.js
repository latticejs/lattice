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

const stories = {
  basic: () => <Widget title="Title">{lorem}</Widget>,

  featured: () => (
    <Widget featured title="Title">
      {lorem}
    </Widget>
  ),

  'with borders': () => (
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
  ),

  squared: () => (
    <Widget title="I have no rounded borders" rounded={false}>
      {lorem}
    </Widget>
  ),

  'custom height': ({ classes }) => (
    <Styled>
      {classes => (
        <Widget title="Custom content height" classes={{ content: classes.content }}>
          <div>{lorem}</div>
        </Widget>
      )}
    </Styled>
  )
};

export default ({ storiesOf }) => {
  const themes = [
    { name: 'widgets/Widget' },
    { name: 'widgets/Widget (dark theme)', theme: { palette: { type: 'dark' } } }
  ];

  themes.forEach(theme => {
    const all = storiesOf(theme.name, module)
      .addDecorator(JssDecorator)
      .addDecorator(InGrid)
      .addDecorator(Flexed)
      .addDecorator(muiTheme(theme.theme))
      .addDecorator(FullViewport);

    Object.keys(stories).forEach(name => {
      all.add(name, withApiReadme(stories[name]));
    });
  });
};

const styles = theme => ({
  content: {
    height: '300px',
    'align-items': 'center'
  },
  customTopBorder: {
    borderColor: 'red'
  },
  customBotomBorder: {
    borderWidth: 15,
    borderColor: 'green'
  }
});

const Styled = withStyles(styles)(({ classes, children }) => {
  return children(classes);
});
