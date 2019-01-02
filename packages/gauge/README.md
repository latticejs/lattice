# @latticejs/gauge

A configurable gauge-like component.

## Install

```bash
npm install @latticejs/gauge
```

## Usage

```javascript
import React, { Component } from 'react';
import RadialGaugeComponent from '@latticejs/gauge';

export class MyGauge extends Component {
  render () {
    const options = {
        width: 400,
        height: 400,
        value: 0
    };
    return (
       <RadialGaugeComponent {...options} />
    );
  }
}

```

## API
Radial Gauge exports same API configuration as [canvas-gauge](https://canvas-gauges.com/). Different configuration can be found on [canvas-config](https://canvas-gauges.com/documentation/user-guide/configuration). Feel free to learn how to do different things using the [examples]( https://rawgit.com/Mikhus/canvas-gauges/master/examples/radial-component.html)