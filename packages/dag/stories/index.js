import React from 'react';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName } from '@material-ui/core/styles';
import { action } from '@storybook/addon-actions';
import { State, Store } from '@sambego/storybook-state';

import Dag from '../src';
import Readme from '../README.md';

// Material UI
import { Paper } from '@material-ui/core';

// Decorators
import muiTheme from '../.storybook/decorator-material-ui';
import { withReadme } from '@latticejs/storybook-readme';

const FullViewport = story => <div style={{ height: '100vh', width: '100vw' }}>{story()}</div>;
const JssDecorator = story => (
  <JssProvider
    generateClassName={createGenerateClassName({
      dangerouslyUseGlobalCSS: true,
      productionPrefix: 'c'
    })}
  >
    {story()}
  </JssProvider>
);

// simple fake props
const getProps = (mix = {}) => {
  const defaults = {
    title: 'Package Dependencies',
    nodes: [
      { title: 'app' },
      { title: 'lodash' },
      { title: 'react' },
      { title: 'react-dom' },
      { title: 'apollo' },
      { title: 'enzyme' }
    ],
    edges: [
      {
        source: 'app',
        target: 'lodash'
      },
      {
        source: 'app',
        target: 'react'
      },
      {
        source: 'app',
        target: 'react-dom'
      },
      {
        source: 'react',
        target: 'react-dom'
      },
      {
        source: 'app',
        target: 'apollo'
      },
      {
        source: 'app',
        target: 'enzyme'
      }
    ],
    width: 500,
    height: 500
  };
  return Object.assign(defaults, mix);
};

const PaperWrap = ({ children }) => (
  <Paper elevation={2} style={{ width: '500px', height: '500px' }}>
    {children}
  </Paper>
);

const loadReadmeSections = withReadme(Readme);
const withApiReadme = loadReadmeSections(['api']);

let props = new Store({ ...getProps() });

export default ({ storiesOf, forceReRender }) => {
  storiesOf('dag/basic', module)
    .addDecorator(JssDecorator)
    .add(
      'no wrapper',
      withApiReadme(() => {
        // TODO(dk): parse real pkg json deps.
        return (
          <Dag
            onClick={action('clicked')}
            onEdgeClick={action('onEdgeClick')}
            onNodeClick={action('onNodeClick')}
            {...getProps()}
          />
        );
      })
    );

  storiesOf('dag/advanced', module).add(
    'editable mode',
    withApiReadme(() => {
      const addNode = node => {
        node.fx = node.x;
        node.fy = node.y;
        const nodes = [...props.get('nodes'), node];
        props.set({ nodes });
      };
      const addEdge = edge => {
        const edges = [...props.get('edges'), edge];
        props.set({ edges });
      };
      const removeNode = ({ nodes, edges }) => {
        props.set({ nodes, edges });
      };
      const removeEdge = edges => {
        props.set({ edges });
      };
      return (
        <State store={props}>
          <Dag
            editable={true}
            onNodeAdded={addNode}
            onEdgeAdded={addEdge}
            onNodeRemoved={removeNode}
            onEdgeRemoved={removeEdge}
            {...props}
          />
        </State>
      );
    })
  );

  storiesOf('dag/themed', module)
    .addDecorator(JssDecorator)
    .addDecorator(muiTheme())
    .addDecorator(FullViewport)
    .add(
      'paper wrapper (light)',
      withApiReadme(() => {
        // TODO(dk): parse pkg json deps.
        const props = getProps();
        return (
          <PaperWrap>
            <Dag onClick={action('clicked')} {...props} />
          </PaperWrap>
        );
      })
    );

  storiesOf('dag/themed', module)
    .addDecorator(JssDecorator)
    .addDecorator(muiTheme({ palette: { type: 'dark' } }))
    .addDecorator(FullViewport)
    .add(
      'paper wrapper (dark)',
      withApiReadme(() => {
        // TODO(dk): parse pkg json deps.
        const props = getProps();
        return (
          <PaperWrap>
            <Dag onClick={action('clicked')} {...props} />
          </PaperWrap>
        );
      })
    );
};
