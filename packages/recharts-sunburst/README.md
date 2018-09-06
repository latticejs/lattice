# @latticejs/recharts-sunburst

A recharts API-compatible sunburst component

## Install

`@latticejs/recharts-sunburst` requires `recharts` to be installed in your project:

```bash
npm install recharts
```

Then install `@latticejs/recharts-sunburst`:

```bash
npm install @latticejs/recharts-sunburst
```

## Usage

Sunburst expects a similar to what recharts/treemap use. Also a proper dataKey will be needed. 

### Example: Basic Sunburst 

> Basic sunburst:

```jsx
import React from 'react';
import { Sunburst } from '@latticejs/recharts-sunburst';

export class BasicSunburst extends React.Component {
  render () {
    const { data, width, height } = this.props;
    return (
      <Sunburst 
        width={width}
        height={height}
        data={data}
        dataKey="size"
        ratio={4 / 3}
        />
    );
  }
}

```

> with a tooltip:

```jsx
import React from 'react';
- import { Sunburst } from '@latticejs/recharts-sunburst';
- import { Tooltip } from './myTooltip';

export class SunburstWithTooltip extends React.Component {
  render () {
    const { data, width, height } = this.props;
    return (
      <Sunburst 
        width={width}
        height={height}
        data={data}
        dataKey="size"
        ratio={4 / 3}
        >
        <Tooltip />
    </Sunburst>
    );
  }
}
```

A sample dataset looks like this:

```javascript
const data = [
  {
    children: [
      { name: 'Data', size: 20544 },
      { name: 'DataList', size: 19788 },
      { name: 'DataSprite', size: 10349 },
      { name: 'EdgeSprite', size: 3301 },
      { name: 'NodeSprite', size: 19382 },
      {
        name: 'render',
        children: [
          { name: 'ArrowType', size: 698 },
          { name: 'EdgeRenderer', size: 5569 },
          { name: 'IRenderer', size: 353 },
          { name: 'ShapeRenderer', size: 2247 }
        ]
      },
      { name: 'ScaleBinding', size: 11275 },
      { name: 'Tree', size: 7147 },
      { name: 'TreeBuilder', size: 9930 }
    ]
  }
];
```

<!-- start:api -->
## API

### dataKey

> `string` | defaults to `value`

Key used to reference data into `data` prop.

### nameKey

> `string` | defaults to `name`

Key used to reference names into `data` prop.

### isAnimationActive

> `boolean` | defaults to `false`

Indicates wether to animate the sunburst.

### isUpdateAnimationActive

> `boolean` | defaults to `false`

Indicates wether to animate the sunburst on data update.

### animationBegin

> `number` | defaults to `0`

Animation delay time.

### animationDuration

> `number` | defaults to `600`

Animation duration.

### animationEasing

> `string` | defaults to `ease-out`

Animation timing function.

<!-- end:api -->


## FAQs

// TBD
