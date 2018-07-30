import React from 'react';

// Ours
import {
  AreaChart,
  BarChart,
  LineChart,
  PieChart,
  RadialBarChart,
  ScatterChart,
  Treemap,
  Area,
  Bar,
  Line,
  Pie,
  RadialBar,
  Scatter,
  ResponsiveContainer,
  XAxis,
  YAxis
} from '../src';
import muiTheme from '../.storybook/decorator-material-ui';
import { JssDecorator } from './utils.js';

// Decorators
const Flexed = story => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>{story()}</div>
);
const FullViewport = story => <div style={{ height: '100vh', width: '100vw' }}>{story()}</div>;

export default ({ storiesOf, action }) => {
  storiesOf('mui-recharts/basic', module)
    .addDecorator(JssDecorator)
    .addDecorator(Flexed)
    .addDecorator(muiTheme())
    .addDecorator(FullViewport)
    .add('Basic charts (light)', () => <BasicCharts />);

  storiesOf('mui-recharts/basic', module)
    .addDecorator(JssDecorator)
    .addDecorator(Flexed)
    .addDecorator(muiTheme({ palette: { type: 'dark' } }))
    .addDecorator(FullViewport)
    .add('Basic charts (dark)', () => <BasicCharts />);
};

// Components

const BasicCharts = props => (
  <React.Fragment>
    <ResponsiveContainer width="25%" aspect={1}>
      <AreaChartBasic />
    </ResponsiveContainer>
    <ResponsiveContainer width="25%" aspect={1}>
      <BarChartBasic />
    </ResponsiveContainer>
    <ResponsiveContainer width="25%" aspect={1}>
      <BarStackChartBasic />
    </ResponsiveContainer>
    <ResponsiveContainer width="25%" aspect={1}>
      <LineChartBasic />
    </ResponsiveContainer>
    <ResponsiveContainer width="25%" aspect={1}>
      <PieChartBasic />
    </ResponsiveContainer>
    <ResponsiveContainer width="25%" aspect={1}>
      <RadialChartBasic />
    </ResponsiveContainer>
    <ResponsiveContainer width="25%" aspect={1}>
      <ScatterChartBasic />
    </ResponsiveContainer>
    <ResponsiveContainer width="25%" aspect={1}>
      <TreeMapBasic />
    </ResponsiveContainer>
  </React.Fragment>
);

const data = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 }
];

const treeData = [
  {
    name: 'axis',
    children: [
      { name: 'Axes', size: 1302 },
      { name: 'Axis', size: 24593 },
      { name: 'AxisGridLine', size: 652 },
      { name: 'AxisLabel', size: 636 },
      { name: 'CartesianAxes', size: 6703 }
    ]
  },
  {
    name: 'controls',
    children: [
      { name: 'AnchorControl', size: 2138 },
      { name: 'ClickControl', size: 3824 },
      { name: 'Control', size: 1353 },
      { name: 'ControlList', size: 4665 },
      { name: 'DragControl', size: 2649 },
      { name: 'ExpandControl', size: 2832 },
      { name: 'HoverControl', size: 4896 },
      { name: 'IControl', size: 763 },
      { name: 'PanZoomControl', size: 5222 },
      { name: 'SelectionControl', size: 7862 },
      { name: 'TooltipControl', size: 8435 }
    ]
  },
  {
    name: 'data',
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
  },
  {
    name: 'events',
    children: [
      { name: 'DataEvent', size: 7313 },
      { name: 'SelectionEvent', size: 6880 },
      { name: 'TooltipEvent', size: 3701 },
      { name: 'VisualizationEvent', size: 2117 }
    ]
  },
  {
    name: 'legend',
    children: [
      { name: 'Legend', size: 20859 },
      { name: 'LegendItem', size: 4614 },
      { name: 'LegendRange', size: 10530 }
    ]
  },
  {
    name: 'operator',
    children: [
      {
        name: 'distortion',
        children: [
          { name: 'BifocalDistortion', size: 4461 },
          { name: 'Distortion', size: 6314 },
          { name: 'FisheyeDistortion', size: 3444 }
        ]
      },
      {
        name: 'encoder',
        children: [
          { name: 'ColorEncoder', size: 3179 },
          { name: 'Encoder', size: 4060 },
          { name: 'PropertyEncoder', size: 4138 },
          { name: 'ShapeEncoder', size: 1690 },
          { name: 'SizeEncoder', size: 1830 }
        ]
      },
      {
        name: 'filter',
        children: [
          { name: 'FisheyeTreeFilter', size: 5219 },
          { name: 'GraphDistanceFilter', size: 3165 },
          { name: 'VisibilityFilter', size: 3509 }
        ]
      },
      { name: 'IOperator', size: 1286 },
      {
        name: 'label',
        children: [
          { name: 'Labeler', size: 9956 },
          { name: 'RadialLabeler', size: 3899 },
          { name: 'StackedAreaLabeler', size: 3202 }
        ]
      },
      {
        name: 'layout',
        children: [
          { name: 'AxisLayout', size: 6725 },
          { name: 'BundledEdgeRouter', size: 3727 },
          { name: 'CircleLayout', size: 9317 },
          { name: 'CirclePackingLayout', size: 12003 },
          { name: 'DendrogramLayout', size: 4853 },
          { name: 'ForceDirectedLayout', size: 8411 },
          { name: 'IcicleTreeLayout', size: 4864 },
          { name: 'IndentedTreeLayout', size: 3174 },
          { name: 'Layout', size: 7881 },
          { name: 'NodeLinkTreeLayout', size: 12870 },
          { name: 'PieLayout', size: 2728 },
          { name: 'RadialTreeLayout', size: 12348 },
          { name: 'RandomLayout', size: 870 },
          { name: 'StackedAreaLayout', size: 9121 },
          { name: 'TreeMapLayout', size: 9191 }
        ]
      },
      { name: 'Operator', size: 2490 },
      { name: 'OperatorList', size: 5248 },
      { name: 'OperatorSequence', size: 4190 },
      { name: 'OperatorSwitch', size: 2581 },
      { name: 'SortOperator', size: 2023 }
    ]
  }
];

const AreaChartBasic = props => (
  <AreaChart data={data} {...props}>
    <Area dataKey="pv" fill="#8884d8" stroke="#8884d8" />
    <Area dataKey="uv" fill="#82ca9d" stroke="#82ca9d" />
  </AreaChart>
);

const BarChartBasic = props => (
  <BarChart data={data} {...props}>
    <Bar dataKey="pv" fill="#8884d8" />
    <Bar dataKey="uv" fill="#82ca9d" />
  </BarChart>
);

const BarStackChartBasic = props => (
  <BarChart data={data} {...props}>
    <Bar dataKey="pv" stackId="1" fill="#8884d8" />
    <Bar dataKey="uv" stackId="1" fill="#82ca9d" />
  </BarChart>
);

const LineChartBasic = props => (
  <LineChart data={data} {...props}>
    <Line dataKey="pv" stroke="#8884d8" />
    <Line dataKey="uv" stroke="#82ca9d" />
  </LineChart>
);

const PieChartBasic = props => (
  <PieChart {...props}>
    <Pie
      dataKey="value"
      data={data.map(d => ({ name: `${d.name} pv`, value: d.pv }))}
      outerRadius={60}
      fill="#8884d8"
    />
    <Pie
      data={data.map(d => ({ name: `${d.name} uv`, value: d.uv }))}
      dataKey="value"
      innerRadius={70}
      outerRadius={90}
      fill="#82ca9d"
    />
  </PieChart>
);

const RadialChartBasic = props => (
  <RadialBarChart {...props} innerRadius={20} barSize={10} data={data}>
    <RadialBar minAngle={15} clockWise={true} dataKey="uv" background fill="#8884d8" />
  </RadialBarChart>
);

const ScatterChartBasic = props => (
  <ScatterChart {...props}>
    <XAxis dataKey="pv" type="number" hide />
    <YAxis dataKey="uv" type="number" hide />
    <Scatter data={data} fill="#8884d8" />
  </ScatterChart>
);

const TreeMapBasic = props => (
  <Treemap
    data={treeData}
    {...props}
    isAnimationActive={false} // Disable animation to avoid snapshot issues.
    dataKey="size"
    ratio={4 / 3}
    stroke="#fff"
    fill="#8884d8"
  />
);
