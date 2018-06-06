import React from 'react';
// recharts
import {
  LineChart as RechartLineChart,
  AreaChart as RechartAreaChart,
  Area,
  Line,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts';
// Ours
import muiTheme from '../.storybook/decorator-material-ui';
import withMuiStyle from '../src';

// Wrapped Charts
const LineChart = withMuiStyle(RechartLineChart);
const AreaChart = withMuiStyle(RechartAreaChart);

// Decorators
const AddResponsive = story => <ResponsiveContainer width="100%">{story()}</ResponsiveContainer>;
const FullViewport = story => <div style={{ height: '100vh', width: '100vw' }}>{story()}</div>;

export default ({ storiesOf, action }) => {
  storiesOf('mui-recharts: light theme', module)
    .addDecorator(AddResponsive)
    .addDecorator(muiTheme())
    .addDecorator(FullViewport)
    .add('Area Chart: basic', () => <AreaChartBasic />)
    .add('Area Chart: axis', () => <AreaChartAxis />)
    .add('Line Chart: basic', () => <LineChartBasic />)
    .add('Line Chart: axis', () => <LineChartAxis />);
  storiesOf('mui-recharts: dark theme', module)
    .addDecorator(AddResponsive)
    .addDecorator(muiTheme({ palette: { type: 'dark' } }))
    .addDecorator(FullViewport)
    .add('Area Chart: basic', () => <AreaChartBasic />)
    .add('Area Chart: axis', () => <AreaChartAxis />)
    .add('Line Chart: basic', () => <LineChartBasic />)
    .add('Line Chart: axis', () => <LineChartAxis />);
};

const data = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 }
];

// Components

const AreaChartBasic = props => (
  <AreaChart data={data} {...props}>
    <Area variant="monotone" dataKey="pv" stroke="#8884d8" strokeWidth={2} />
    <Area variant="monotone" dataKey="uv" stroke="#82ca9d" />
    <Tooltip />
  </AreaChart>
);

const AreaChartAxis = props => (
  <AreaChart data={data} {...props}>
    <XAxis dataKey="name" />
    <YAxis />
    <Area variant="monotone" dataKey="pv" stroke="#8884d8" strokeWidth={2} />
    <Area variant="monotone" dataKey="uv" stroke="#82ca9d" />
    <Tooltip />
  </AreaChart>
);

const LineChartBasic = props => (
  <LineChart data={data} {...props}>
    <Line variant="monotone" dataKey="pv" stroke="#8884d8" strokeWidth={2} />
    <Line variant="monotone" dataKey="uv" stroke="#82ca9d" />
    <Tooltip />
  </LineChart>
);

const LineChartAxis = props => (
  <LineChart data={data} {...props}>
    <XAxis dataKey="name" />
    <YAxis />
    <Line variant="monotone" dataKey="pv" stroke="#8884d8" strokeWidth={2} />
    <Line variant="monotone" dataKey="uv" stroke="#82ca9d" />
    <Tooltip />
  </LineChart>
);
