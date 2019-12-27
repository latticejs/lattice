import React, { Component } from 'react';

// Ours
import Map from '../src';
import muiTheme from '../.storybook/decorator-material-ui';
import Mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { withReadme } from '@latticejs/storybook-readme';
import Readme from '../README.md';
import '../styles/style.css';
import { token } from '../config';

const FullViewport = story => <div style={{ height: '100vh', width: '100vw', padding: 12 }}>{story()}</div>;

class BasicMap extends Component {
  afterMapLoad = mapObj => {
    let navigation = new Mapboxgl.NavigationControl();
    mapObj.addControl(navigation, 'top-left');
    mapObj.addControl(
      new MapboxGeocoder({
        accessToken: Mapboxgl.accessToken,
        mapboxgl: Mapboxgl
      })
    );
    mapObj.on('render', function(evt) {
      let layers = ['country-label-lg', 'place-city-sm'];
      layers.map(layer => {
        mapObj.setLayoutProperty(layer, 'text-field', [
          'format',
          ['get', 'name_en'],
          {
            'font-scale': 1.2,
            'text-font': ['literal', ['Roboto Bold']]
          }
        ]);
        return null;
      });
    });
  };

  render() {
    return (
      <Map
        longitude={5}
        latitude={34}
        zoom={1}
        accessToken={token}
        afterMapComplete={this.afterMapLoad}
        height={91}
        width={100}
      />
    );
  }
}

class DarkMap extends Component {
  afterMapLoad = mapObj => {
    let navigation = new Mapboxgl.NavigationControl();
    mapObj.addControl(navigation, 'top-left');
    mapObj.addControl(
      new MapboxGeocoder({
        accessToken: Mapboxgl.accessToken,
        mapboxgl: Mapboxgl
      })
    );
    mapObj.on('render', function(evt) {
      let layers = ['country-label-lg', 'place-city-sm'];
      layers.map(layer => {
        mapObj.setLayoutProperty(layer, 'text-field', [
          'format',
          ['get', 'name_en'],
          {
            'font-scale': 1.2,
            'text-font': ['literal', ['Roboto Bold']]
          }
        ]);
        return null;
      });
    });
  };

  render() {
    return (
      <Map
        longitude={5}
        latitude={34}
        zoom={1}
        mapStyle="dark-v9"
        accessToken={token}
        afterMapComplete={this.afterMapLoad}
        height={91}
        width={100}
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
