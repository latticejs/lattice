import React from 'react';

import { Map } from '../components/';
import muiTheme from '../../.storybook/decorator-material-ui';
import Mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '../../styles/style.css';
import { token } from '../../config';

export default {
  title: 'Example/Map',
  component: Map
};

const BasicMap = () => {
  const afterMapLoad = (mapObj) => {
    let navigation = new Mapboxgl.NavigationControl();
    mapObj.addControl(navigation, 'top-left');
    mapObj.addControl(
      new MapboxGeocoder({
        accessToken: Mapboxgl.accessToken,
        mapboxgl: Mapboxgl,
      })
    );
  };

  return (
    <Map
      longitude={5}
      latitude={34}
      zoom={1}
      accessToken={token}
      afterMapComplete={afterMapLoad}
      height={91}
      width={100}
    />
  );
}

const Template = () => <BasicMap />;

export const Basic = Template.bind({});
Basic.decorators = [muiTheme()]

export const Dark = Template.bind({});
Dark.decorators = [muiTheme({ palette: { type: 'dark' } })]

