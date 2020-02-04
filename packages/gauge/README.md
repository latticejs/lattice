# @latticejs/gauge

A configurable gauge-like component built upon `canvas-gauges`.

## Install

```bash
npm install @latticejs/gauge
```

## Usage

```javascript
import React from 'react';
import Gauge from '@latticejs/gauge';

const MyGauge = () => (
  <Gauge value={42} />
);

export default MyGauge; 
```

The above snippet will render a basic gauge with a material _look'n'feel_. It also support themes (dark, light). 

<!-- start:gauge -->
## Gauge

### value 

> `number` | Defaults to 0 

Used to indicate gauge default value.

### settings

> `object` | Defaults to {}

Lattice's Gauge exports the same API configuration as [canvas-gauges](https://canvas-gauges.com/). Use this option to pass any specific configuration.

Different configuration can be found on [canvas-config](https://canvas-gauges.com/documentation/user-guide/configuration). Feel free to learn how to do different things using the [examples]( https://rawgit.com/Mikhus/canvas-gauges/master/examples/radial-component.html).

<!-- end:gauge -->
