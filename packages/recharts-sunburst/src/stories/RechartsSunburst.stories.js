import React from 'react';

import Sunburst from '../components/index.js';
import { Tooltip } from 'recharts';

export default {
  title: 'Example/Sunburst',
  component: Sunburst,
};

const data = [
  {
    name: 'All',
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

const colors = {
  All: '#5687d1',
  Data: '#7b615c',
  DataList: '#de783b',
  DataSprite: '#6ab975',
  EdgeSprite: '#a173d1',
  NodeSprite: '#bbbbbb',
  render: '#5687d1',
  ArrowType: '#7b615c',
  EdgeRenderer: '#de783b',
  IRenderer: '#6ab975',
  ShapeRenderer: '#a173d1',
  ScaleBinding: '#bbbbbb',
};

const Template = (args) => {
  if (args.type === 'basic') {
    return <Sunburst data={data} dataKey="size" fill="#8884d8" height={411} width={1572} />;
  }
  if (args.type === 'animated') {
    return <Sunburst data={data} dataKey="size" fill="#8884d8" isAnimationActive height={411} width={1572} />;
  }
  if (args.type === 'customized') {
    return (
      <Sunburst data={data} colors={colors} dataKey="size" nameKey="name" fill="#8884d8" height={411} width={1572} />
    );
  }
  if (args.type === 'tooltip') {
    return (
      <Sunburst data={data} dataKey="size" nameKey="name" height={411} width={1572}>
        <Tooltip />
      </Sunburst>
    );
  }
};

export const BasicSunburst = Template.bind({});
BasicSunburst.args = {
  type: 'basic',
};

export const BasicSunburstAnimated = Template.bind({});
BasicSunburstAnimated.args = {
  type: 'animated',
};

export const SunburstCustomizedColors = Template.bind({});
SunburstCustomizedColors.args = {
  type: 'customized',
};

export const SunburstTooltip = Template.bind({});
SunburstTooltip.args = {
  type: 'tooltip',
};
