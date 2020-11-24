import React from 'react';

// Material UI
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

// Ours
import { Widget } from '../components';
import muiTheme from '../../.storybook/decorator-material-ui';

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum. A pellentesque sit amet porttitor eget. Aenean sed adipiscing diam donec adipiscing tristique risus.`;

export default {
  title: 'Widgets/Widget (dark theme)',
  component: Widget,
};

const Template = (args) => {
  if (args.type === 'basic') {
    return <Widget title="Title">{lorem}</Widget>;
  }
  if (args.type === 'featured') {
    return (
      <Widget featured title="Title">
        {lorem}
      </Widget>
    );
  }
  if (args.type === 'withborders') {
    return (
      <Styled>
        {(classes) => (
          <Grid container spacing={3}>
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
    );
  }
  if (args.type === 'squared') {
    return (
      <Widget title="I have no rounded borders" rounded={false}>
        {lorem}
      </Widget>
    );
  }
  if (args.type === 'customheight') {
    return (
      <Styled>
        {(classes) => (
          <Widget title="Custom content height" classes={{ content: classes.content }}>
            <div>{lorem}</div>
          </Widget>
        )}
      </Styled>
    );
  }
};

export const Basic = Template.bind({});
Basic.decorators = [muiTheme({ palette: { type: 'dark' } })];
Basic.args = {
  type: 'basic',
};

export const Featured = Template.bind({});
Featured.decorators = [muiTheme({ palette: { type: 'dark' } })];
Featured.args = {
  type: 'featured',
};

export const WithBorders = Template.bind({});
WithBorders.decorators = [muiTheme({ palette: { type: 'dark' } })];
WithBorders.args = {
  type: 'withborders',
};

export const Squared = Template.bind({});
Squared.decorators = [muiTheme({ palette: { type: 'dark' } })];
Squared.args = {
  type: 'squared',
};

export const CustomHeight = Template.bind({});
CustomHeight.decorators = [muiTheme({ palette: { type: 'dark' } })];
CustomHeight.args = {
  type: 'customheight',
};

const styles = (theme) => ({
  content: {
    height: '300px',
    'align-items': 'center',
  },
  customTopBorder: {
    borderColor: 'red',
  },
  customBotomBorder: {
    borderWidth: 15,
    borderColor: 'green',
  },
});

const Styled = withStyles(styles)(({ classes, children }) => {
  return children(classes);
});
