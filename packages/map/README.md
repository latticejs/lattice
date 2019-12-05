# @latticejs/map

A configurable map-like component built upon `mapbox`.

## Install

```bash
npm install @latticejs/map --save-dev
```

## Usage

```javascript
import React from 'react';
import LatticeMap from '@latticejs/map';
import Mapboxgl from 'mapbox-gl';
import '@latticejs/map/css/style.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

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

const MyMap = () => (
  <LatticeMap
    longitude = {5}
    latitude = {34}
    zoom = {1.5}
    accessToken = 'Your access token here..'
    afterMapComplete={this.afterMapLoad}
    height={91}
    width={100}
  />;
);

export default MyMap; 
```

The above snippet will render a basic Map with a material _look'n'feel_. It also support themes (dark, light).


### Props 
>  `longitude`
>  `latitude`
>  `zoom`
>  `accessToken`
>  `afterMapComplete`
>  `height`
>  `width`

you can also pass other props, Here are the refrence of props list [reference](https://docs.mapbox.com/mapbox-gl-js/api/). Use this option to pass any specific configuration.


### Get Map Object
- You can also get the Map object to add other controls or customization.
- use `getMap()` it will return the map object on which you can add other controls like marker, navigation ect.

## Ex:- 
`
  afterMapLoad = (mapObj) => {
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
  }
`

- We are passing `afterMapComplete={this.afterMapLoad}` as props
- Once Map creation functionality completed it return `mapObj`.
- In `afterMapLoad()` we have added `Navigation`and `Search` control.
- You can also get more [Example](https://docs.mapbox.com/mapbox-gl-js/examples/) for reference.