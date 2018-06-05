import React from 'react';
import { storiesOf } from '@storybook/react';
import Sunburst from '../';

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
          { name: 'ShapeRenderer', size: 2247 },
        ],
      },
      { name: 'ScaleBinding', size: 11275 },
      { name: 'Tree', size: 7147 },
      { name: 'TreeBuilder', size: 9930 },
    ],
  },
];

export default ({storiesOf, action})  => {
storiesOf('recharts-sunburst', module)
  .add('basic sunburst', () => (
      <Sunburst
        width={500}
        height={500}
        data={data}
        dataKey='size'
        ratio={4/3}
        isTooltipActive={true}
      />
  ))
}
