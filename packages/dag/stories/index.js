import React from 'react';
import Dag from '../src';
// Material UI
import { Paper } from '@material-ui/core';
// Decorators
import muiTheme from '../.storybook/decorator-material-ui';
const FullViewport = story => <div style={{ height: '100vh', width: '100vw' }}>{story()}</div>;

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

export default ({ storiesOf, action, forceReRender }) => {
  storiesOf('dag/basic', module)
    .add('no wrapper', () => {
      // TODO(dk): parse real pkg json deps.
      return <Dag onClick={action('clicked')} {...getProps()} />;
    })
    .add('editable mode', () => {
      return (
        <Dag editable={true} onEdgeAdded={action('onEdgeAdded')} onNodeAdded={action('onNodeAdded')} {...getProps()} />
      );
    });

  storiesOf('dag/themed', module)
    .addDecorator(muiTheme())
    .addDecorator(FullViewport)
    .add('paper wrapper (light)', () => {
      // TODO(dk): parse pkg json deps.
      const props = getProps();
      return (
        <PaperWrap>
          <Dag onClick={action('clicked')} {...props} />
        </PaperWrap>
      );
    });

  storiesOf('dag/themed', module)
    .addDecorator(muiTheme({ palette: { type: 'dark' } }))
    .addDecorator(FullViewport)
    .add('paper wrapper (dark)', () => {
      // TODO(dk): parse pkg json deps.
      const props = getProps();
      return (
        <PaperWrap>
          <Dag onClick={action('clicked')} {...props} />
        </PaperWrap>
      );
    });
};
