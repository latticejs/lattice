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
    />;
);

export default MyMap; 
```

The above snippet will render a basic Map with a material _look'n'feel_. It also support themes (dark, light). 


## API


### value 

Used to indicate map default value.

### settings

> `object` | Defaults to {}

Lattice's Map exports the same API configuration as [mapbox](https://www.mapbox.com/). Use this option to pass any specific configuration.

Different configuration can be found on [mapbox-config](https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/). Feel free to learn how to do different things using the [examples]( https://docs.mapbox.com/mapbox-gl-js/examples/).

