# @latticejs/gauge

A configurable gauge-like component.

## Install

```bash
npm install @latticejs/gauge
```

## Usage

```javascript
import React, { Component } from 'react';
import Gauge from '@latticejs/gauge';

export class MyGauge extends Component {
  render () {
    const { value } = this.props;
    return (
       <Gauge value={value} />
    );
  }
}

```

## API

<!-- start:gauge -->
### value

> `Number` | *required*

This will be used to indicate the current gauge's value.

### min

> `Number|Function`

Indicates the minimun value for the gauge's scale. Defaults to 0. If a function is passed, the result must be a number.

### max

> `Number|Function`

Indicates the maximun value for the gauge's scale. Defaults to 100. If a function is passed, the result must be a number.

### label

> `String|function({ currentValue })`

If passed, this prop will be used for the gauge label. If a function is passed it will be called with the current value as a param. The function must return a String. Defaults to ''.

### showCurrentValue

> `Boolean`

Used to show/hide the current value. Defaults to `true`.

### zones 

> `Array<{ label: String, from:Number, to: Number, action({ currentValue }):Function }>`

This can be used to show custom _arc labels_ between from-to also dividing the gauge in different sections. One extra param is the `action` function which can be used to trigger a custom behavior based on the current value. If the function returns a string it will be used to replace the current arc label.

It defaults to:
```
[
  {
    label: '',
    from: 0,
    to: 100,
    action: function(){}
  }
]
```

<!-- end:gauge -->
