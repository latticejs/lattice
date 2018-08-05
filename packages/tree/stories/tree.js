import React, { Component } from 'react';

// Ours
import Tree from '../src/tree';
import muiTheme from '../.storybook/decorator-material-ui';

const Flexed = story => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>{story()}</div>
);

const FullViewport = story => <div style={{ height: '100vh', width: '100vw', padding: 12 }}>{story()}</div>;

class BasicTree extends Component {
  state = {
    treeData: [
      {
        label: 'index.js'
      },
      {
        label: 'assets',
        children: [
          {
            label: 'index.css'
          },
          {
            label: 'logo.svg'
          },
          {
            label: 'tmp',
            children: [
              {
                label: 'foo',
                children: [
                  {
                    label: 'lambda'
                  },
                  {
                    label: 'gamma'
                  }
                ]
              },
              {
                label: 'bar'
              },
              {
                label: 'baz'
              }
            ]
          }
        ]
      }
    ]
  };

  render() {
    return <Tree treeData={this.state.treeData} {...this.props} />;
  }
}

export default ({ storiesOf, action }) => {
  storiesOf('tree', module)
    .addDecorator(Flexed)
    .addDecorator(muiTheme())
    .addDecorator(FullViewport)
    .add('basic', () => (
      <BasicTree
        onCheckItem={action('checkItem')}
        onFoldItem={action('onFoldItem')}
        onUnfoldItem={action('onUnfoldItem')}
      />
    ));
};
