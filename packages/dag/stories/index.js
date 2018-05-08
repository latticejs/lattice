import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Dag from '../';

storiesOf('Directed Acyclic Graph Component', module)
  .add('with some props (emulating super simple package.json)', () => {
    // TODO(dk): parse pkg json deps.
    const someProps = {
      nodes: [
        {title: 'app'},
        {title: 'lodash'}
      ],
      edges: [{
        source: 'app',
        target: 'lodash'
      }],
      width: 500,
      height: 500
    }

    return <Dag onClick={action('clicked')} {...someProps} />
  })
