# @latticejs/map

A configurable map-like component built upon `mapbox`.

## Install

```bash
npm install @latticejs/map
```

## Usage

```javascript
import React from 'react';
import Map from '@latticejs/map';

const MyMap = () => (
  <Map
    longitude = {5}
    latitude = {34}
    zoom = {1.5}
    accessToken = 'Your access token here..'
    afterMapComplete={this.afterMapLoad}
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

you can also pass other props, Here are the refrence of props list [refrence](https://docs.mapbox.com/mapbox-gl-js/api/). Use this option to pass any specific configuration.


### Get Map Object
- You can also get the Map object to add other controls or customization.
- use `getMap()` it will return the map object on which you can add other controls like marker, navigation ect.

Ex:- `
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

We are passing `afterMapComplete={this.afterMapLoad}` as props and Once Map creation functionality completed it return mapObject and then in `afterMapLoad()` we are working on customization. We added here `Navigation`, We have added control to `Search` any place on Map.