import React from 'react';
import { AreaChart, BarChart, LineChart, Area, Bar, Line, Tooltip, XAxis, YAxis, MuiRecharts } from '../components';
import muiTheme from '../../.storybook/decorator-material-ui';

export default {
  title: 'Example/Mui-Recharts',
  component: MuiRecharts,
};

const data = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
];

const AreaChartBasic = (props) => (
  <MuiRecharts data={data} WrappedChart={AreaChart} {...props}>
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Area dataKey="pv" fill="#8884d8" stroke="#8884d8" />
    <Area dataKey="uv" fill="#82ca9d" stroke="#82ca9d" />
  </MuiRecharts>
);

const BarChartBasic = (props) => (
  <MuiRecharts data={data} WrappedChart={BarChart} {...props}>
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="pv" fill="#8884d8" />
    <Bar dataKey="uv" fill="#82ca9d" />
  </MuiRecharts>
);

const LineChartBasic = (props) => (
  <MuiRecharts data={data} WrappedChart={LineChart} {...props}>
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Line dataKey="pv" stroke="#8884d8" />
    <Line dataKey="uv" stroke="#82ca9d" />
  </MuiRecharts>
);

const Template = (args) => {
  if (args.type === 'AreaLight') {
    return <AreaChartBasic {...args} />;
  }
  if (args.type === 'BarLight') {
    return <BarChartBasic {...args} />;
  }
  if (args.type === 'LineLight') {
    return <LineChartBasic {...args} />;
  }

  if (args.type === 'AreaDark') {
    return <AreaChartBasic {...args} />;
  }
  if (args.type === 'BarDark') {
    return <BarChartBasic {...args} />;
  }

  if (args.type === 'LineDark') {
    return <LineChartBasic {...args} />;
  }
};

export const AreaLight = Template.bind({});
AreaLight.args = {
  type: 'AreaLight',
};
export const BarLight = Template.bind({});
BarLight.args = {
  type: 'BarLight',
};
export const LineLight = Template.bind({});
LineLight.args = {
  type: 'LineLight',
};

export const AreaDark = Template.bind({});
AreaDark.args = {
  type: 'AreaDark',
};
export const BarDark = Template.bind({});
BarDark.args = {
  type: 'BarDark',
};
export const LineDark = Template.bind({});
LineDark.args = {
  type: 'LineDark',
};

AreaLight.decorators = [muiTheme()];
BarLight.decorators = [muiTheme()];
LineLight.decorators = [muiTheme()];

AreaDark.decorators = [muiTheme({ palette: { type: 'dark' } })];
BarDark.decorators = [muiTheme({ palette: { type: 'dark' } })];
LineDark.decorators = [muiTheme({ palette: { type: 'dark' } })];
