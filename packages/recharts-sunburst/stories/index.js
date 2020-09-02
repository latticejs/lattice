import React from 'react';
import { Tooltip, ResponsiveContainer } from 'recharts';
import { JssProvider } from 'react-jss';
import { createGenerateClassName } from '@material-ui/core/styles';
import Readme from '../README.md';
import { withReadme } from '@latticejs/storybook-readme';

// Ours
import Sunburst from '../src';

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

// Decorators
const AddResponsive = (story) => <ResponsiveContainer>{story()}</ResponsiveContainer>;
const FullViewport = (story) => <div style={{ height: '100vh', width: '100vw' }}>{story()}</div>;
const JssDecorator = (story) => (
  <JssProvider
    generateClassName={createGenerateClassName({
      dangerouslyUseGlobalCSS: true,
      productionPrefix: 'c',
    })}
  >
    {story()}
  </JssProvider>
);

const withApiReadme = withReadme(Readme)(['api']);

export default ({ storiesOf }) => {
  storiesOf('recharts-sunburst', module)
    .addDecorator(AddResponsive)
    .addDecorator(FullViewport)
    .addDecorator(JssDecorator)
    .add(
      'basic sunburst',
      withApiReadme(() => <Sunburst data={data} dataKey="size" fill="#8884d8" />)
    )
    .add(
      'basic sunburst animated',
      withApiReadme(() => <Sunburst data={data} dataKey="size" fill="#8884d8" isAnimationActive />)
    )
    .add(
      'with customized colors',
      withApiReadme(() => <Sunburst data={data} colors={colors} dataKey="size" nameKey="name" fill="#8884d8" />)
    )
    .add(
      'with tooltip',
      withApiReadme(() => (
        <Sunburst data={data} dataKey="size" nameKey="name">
          <Tooltip />
        </Sunburst>
      ))
    );
};
