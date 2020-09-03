import React, { Component } from 'react';

// Ours
import Editor from '../src/index.js';
import muiTheme from '../.storybook/decorator-material-ui';
import { withReadme } from '@latticejs/storybook-readme';
import Readme from '../README.md';
import '../styles/css/style.css';

const FullViewport = (story) => <div style={{ height: '100vh', width: '100vw', padding: 12 }}>{story()}</div>;

class BasicEditor extends Component {
  render() {
    return <Editor />;
  }
}

const loadReadmeSections = withReadme(Readme);
const withApiReadme = loadReadmeSections(['api']);

export default ({ storiesOf }) => {
  storiesOf('Froala Editor', module)
    .addDecorator(muiTheme())
    .addDecorator(FullViewport)
    .add(
      'BasicEditor',
      withApiReadme(() => <BasicEditor />)
    );

  storiesOf('Froala Editor', module)
    .addDecorator(muiTheme({ palette: { type: 'dark' } }))
    .addDecorator(FullViewport)
    .add(
      'Dark',
      withApiReadme(() => <BasicEditor />)
    );
};
