import React, { Component } from 'react';
// import { action } from '@storybook/addon-actions';

// Ours
import { RichText } from '../src';
import muiTheme from '../.storybook/decorator-material-ui';
import { withReadme } from '@latticejs/storybook-readme';
import Readme from '../README.md';

const Flexed = story => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>{story()}</div>
);

const FullViewport = story => <div style={{ height: '100vh', width: '100vw', padding: 12 }}>{story()}</div>;

class BasicEditor extends Component {
  render() {
    return <RichText {...this.props} />;
  }
}

const loadReadmeSections = withReadme(Readme);
const withApiReadme = loadReadmeSections(['api']);

export default ({ storiesOf }) => {
  storiesOf('rich-text', module)
    .addDecorator(Flexed)
    .addDecorator(muiTheme())
    .addDecorator(FullViewport)
    .add('basic', withApiReadme(() => <BasicEditor />));
};
