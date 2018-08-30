import React from 'react';

// Ours
import { AreaChart, BarChart, LineChart, Area, Bar, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from '../src';
import muiTheme from '../.storybook/decorator-material-ui';
import { JssDecorator } from './utils.js';

// Decorators
const AddResponsive = story => <ResponsiveContainer>{story()}</ResponsiveContainer>;
const FullViewport = story => <div style={{ height: '100vh', width: '100vw' }}>{story()}</div>;

export default ({ storiesOf }) => {
  storiesOf('mui-recharts/axis & tooltips', module)
    .addDecorator(AddResponsive)
    .addDecorator(JssDecorator)
    .addDecorator(muiTheme())
    .addDecorator(FullViewport)
    .add('Area (light)', () => <AreaChartBasic />)
    .add('Bar (light)', () => <BarChartBasic />)
    .add('Line (light)', () => <LineChartBasic />);

  storiesOf('mui-recharts/axis & tooltips', module)
    .addDecorator(AddResponsive)
    .addDecorator(JssDecorator)
    .addDecorator(muiTheme({ palette: { type: 'dark' } }))
    .addDecorator(FullViewport)
    .add('Area (dark)', () => <AreaChartBasic />)
    .add('Bar (dark)', () => <BarChartBasic />)
    .add('Line (dark)', () => <LineChartBasic />);
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
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Area dataKey="pv" fill="#8884d8" stroke="#8884d8" />
    <Area dataKey="uv" fill="#82ca9d" stroke="#82ca9d" />
  </AreaChart>
);

const BarChartBasic = props => (
  <BarChart data={data} {...props}>
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="pv" fill="#8884d8" />
    <Bar dataKey="uv" fill="#82ca9d" />
  </BarChart>
);

const LineChartBasic = props => (
  <LineChart data={data} {...props}>
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Line dataKey="pv" stroke="#8884d8" />
    <Line dataKey="uv" stroke="#82ca9d" />
  </LineChart>
);
