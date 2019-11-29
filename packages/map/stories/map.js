import React, { Component } from 'react';

// Ours
import Map from '../src';
import muiTheme from '../.storybook/decorator-material-ui';
import { withReadme } from '@latticejs/storybook-readme';
import Readme from '../README.md';
import '../css/style.css';

const FullViewport = story => <div style={{ height: '100vh', width: '100vw', padding: 12 }}>{story()}</div>;

class BasicMap extends Component {
  render() {
    return (
      <Map
        longitude={5}
        latitude={34}
        zoom={1}
        accessToken="pk.eyJ1IjoiY2VsZXN0aWFsc3lzIiwiYSI6ImNrMzVoZTY2ZzA0ZmczY3J3cWlqbmptcXcifQ.0m0LKMmE9yGqFTXbZ-h4bQ"
      />
    );
  }
}

class DarkMap extends Component {
  render() {
    return (
      <Map
        longitude={5}
        latitude={34}
        zoom={1}
        mapStyle="dark-v9"
        accessToken="pk.eyJ1IjoiY2VsZXN0aWFsc3lzIiwiYSI6ImNrMzVoZTY2ZzA0ZmczY3J3cWlqbmptcXcifQ.0m0LKMmE9yGqFTXbZ-h4bQ"
      />
    );
  }
}

const loadReadmeSections = withReadme(Readme);
const withApiReadme = loadReadmeSections(['api']);

export default ({ storiesOf }) => {
  storiesOf('Map', module)
    .addDecorator(muiTheme())
    .addDecorator(FullViewport)
    .add(
      'Basic',
      withApiReadme(() => <BasicMap />)
    );

  storiesOf('Map', module)
    .addDecorator(muiTheme({ palette: { type: 'dark' } }))
    .addDecorator(FullViewport)
    .add(
      'Dark',
      withApiReadme(() => <DarkMap />)
    );
};
