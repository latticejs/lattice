# @latticejs/mui-recharts

This module will add a `material-ui` wrapper for `recharts` chart components. 

## Install

`@latticejs/mui-recharts` requires both `@material-ui/core` and `recharts` to be installed in your project:

```bash
npm install @material-ui/core recharts
```

Then install `@latticejs/mui-recharts`:

```bash
npm install @latticejs/mui-recharts
```

## Usage

Just use any of the `recharts` components thru `@latticejs/mui-recharts`. This will wrap the components and return a styled chart using your `mui-theme` defaults.

### Example: Basic Line Chart 

> with recharts:

```jsx
import React from 'react';
import { LineChart, Line, Tooltip } from 'recharts';

export class BasicLineChart extends React.Component {
  render () {
    const { data, ...props } = this.props;
    return (
      <LineChart data={data} {...props}>
        <Tooltip />
        <Line dataKey="pv" stroke="#8884d8" />
        <Line dataKey="uv" stroke="#82ca9d" />
      </LineChart>      
    );
  }
}

```

> with @latticejs/mui-recharts

```diff
import React from 'react';
- import { LineChart, Line } from 'recharts';
+ import { LineChart, Line } from '@latticejs/mui-recharts';

export class BasicLineChart extends React.Component {
  render () {
    const { data, ...props } = this.props;
    return (
      <LineChart data={data} {...props}>
        <Tooltip />
        <Line dataKey="pv" stroke="#8884d8" />
        <Line dataKey="uv" stroke="#82ca9d" />
      </LineChart>      
    );
  }
}

```

## API

// TBD


## FAQs

// TBD
