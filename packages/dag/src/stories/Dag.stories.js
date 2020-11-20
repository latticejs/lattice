import React from 'react';

import { Dag, dagRenderEdgeActions, dagRenderNodeActions } from '../components/';
import { action } from '@storybook/addon-actions';
import { State, Store } from '@sambego/storybook-state';
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import muiTheme from '../../.storybook/decorator-material-ui';

export default {
  title: 'Example/Dag',
  component: Dag,
};
const useStyles = makeStyles((theme) => {
  return {
    PaperDag: {
      backgroundColor: theme.palette.background.default,
    },
  };
});
const getProps = (mix = {}) => {
  const defaults = {
    title: 'Package Dependencies',
    nodes: [
      { title: 'app' },
      { title: 'lodash' },
      { title: 'react' },
      { title: 'react-dom' },
      { title: 'apollo' },
      { title: 'enzyme' },
    ],
    edges: [
      {
        source: 'app',
        target: 'lodash',
      },
      {
        source: 'app',
        target: 'react',
      },
      {
        source: 'app',
        target: 'react-dom',
      },
      {
        source: 'react',
        target: 'react-dom',
      },
      {
        source: 'app',
        target: 'apollo',
      },
      {
        source: 'app',
        target: 'enzyme',
      },
    ],
    width: 800,
    height: 800,
  };
  return Object.assign(defaults, mix);
};

const PaperWrap = ({ children }) => {
  const classes = useStyles();
  return (
    <Paper className={classes.PaperDag} elevation={2} style={{ width: '800px', height: '800px' }}>
      {children}
    </Paper>
  );
};

const props = new Store({ ...getProps() });
const Template = (args) => {
  if (args.type === 'Basic') {
    return <Dag {...args} />;
  }
  if (args.type === 'Advanced') {
    return (
      <State store={props}>
        <Dag {...props.state} {...args} />
      </State>
    );
  }
  if (args.type === 'LightThemed') {
    return (
      <PaperWrap>
        <Dag onClick={action('clicked')} {...args} />
      </PaperWrap>
    );
  }
  if (args.type === 'DarkThemed') {
    return (
      <PaperWrap>
        <Dag onClick={action('clicked')} {...args} />
      </PaperWrap>
    );
  }
};

export const DagBasic = Template.bind({});
DagBasic.args = {
  zoomEnable: true,
  ...getProps(),
  type: 'Basic',
};
DagBasic.argTypes = {
  onClick: { action: 'clicked' },
  onEdgeClick: { action: 'onEdgeClick' },
  onNodeClick: { action: 'onNodeClick' },
};

export const DagAdvanced = Template.bind({});
const addNode = (node) => {
  node.fx = node.x;
  node.fy = node.y;
  const nodes = [...props.get('nodes'), node];
  props.set({ nodes });
};
const addEdge = (edge) => {
  const edges = [...props.get('edges'), edge];
  props.set({ edges });
};
const removeNode = ({ nodes, edges }) => {
  props.set({ nodes, edges });
};
const removeEdge = (edges) => {
  props.set({ edges });
};
DagAdvanced.args = {
  type: 'Advanced',
  editable: true,
  panEnable: true,
  zoomEnable: true,
  onNodeAdded: addNode,
  onEdgeAdded: addEdge,
  onNodeRemoved: removeNode,
  onEdgeRemoved: removeEdge,
  renderNodeActions: dagRenderNodeActions,
  renderEdgeActions: dagRenderEdgeActions,
};

export const DagLightThemed = Template.bind({});
DagLightThemed.args = {
  zoomEnable: true,
  ...getProps(),
  type: 'LightThemed',
};

export const DagDarkThemed = Template.bind({});
DagDarkThemed.args = {
  zoomEnable: true,
  ...getProps(),
  type: 'DarkThemed',
};

DagBasic.decorators = [muiTheme()];
DagLightThemed.decorators = [muiTheme()];
DagAdvanced.decorators = [muiTheme()];

//dark theme decorators
DagDarkThemed.decorators = [muiTheme({ palette: { type: 'dark' } })];
