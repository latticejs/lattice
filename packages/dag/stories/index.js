import React from 'react';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName } from '@material-ui/core/styles';
import { action } from '@storybook/addon-actions';

import Dag from '../src';
import Readme from '../README.md';

// Material UI
import { Paper } from '@material-ui/core';

// Decorators
import muiTheme from '../.storybook/decorator-material-ui';
import { withReadme } from '@latticejs/utils';

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
    )
    .add(
      'editable mode',
      withApiReadme(() => {
        return (
          <Dag
            editable={true}
            onEdgeAdded={action('onEdgeAdded')}
            onNodeAdded={action('onNodeAdded')}
            onEdgeRemoved={action('onEdgeRemoved')}
            onNodeRemoved={action('onNodeRemoved')}
            {...getProps()}
          />
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
