import React from 'react';
import { Gauge } from '../components/Gauge';
import muiTheme from '../../.storybook/decorator-material-ui';

export default {
  title: 'Example/Gauge',
  component: Gauge,
};

const basicGaugeSettings = {
  width: 250,
  height: 250,
  minValue: 0,
  startAngle: 90,
  ticksAngle: 180,
  needleStart: 70,
  needleEnd: 95,
  valueBox: false,
  maxValue: 100,
  highlights: [],
  barWidth: 20,
  majorTicks: [],
  minorTicks: 0,
  strokeTicks: false,
  colorPlate: 'transparent',
  colorMajorTicks: 'transparent',
  colorNumbers: 'transparent',
  borderShadowWidth: 0,
  borders: false,
  needleType: 'line',
  needleWidth: 3,
  needleCircleOuter: false,
  needleCircleInner: false,
  animationDuration: 1500,
};

const customGauge = {
  units: 'mph',
  width: 300,
  height: 300,
  barWidth: '5',
  barShadow: '0',
  borderShadowWidth: '20',
  borderInnerWidth: '0',
  borderOuterWidth: '0',
  borderMiddleWidth: '0',
  highlights: 'false',
  valueBoxStroke: '0',
  needleWidth: '3',
  animateOnInit: 'true',
  animatedValue: 'true',
  animationDuration: '1500',
  animationRule: 'linear',
  colorValueBoxShadow: '0',
  valueBoxBorderRadius: '0',
  valueTextShadow: '0',
  needleType: 'arrow',
  colorValueBoxBackground: 'transparent',
};

const BasicThemedGauge = {
  width: 250,
  height: 250,
  startAngle: 90,
  ticksAngle: 180,
  needleStart: 70,
  needleEnd: 95,
  valueBox: false,
  maxValue: 100,
  highlights: [],
  barWidth: 20,
  majorTicks: [],
  minorTicks: 0,
  strokeTicks: false,
  colorPlate: 'transparent',
  colorMajorTicks: 'transparent',
  colorNumbers: 'transparent',
  borderShadowWidth: 0,
  borders: false,
  needleType: 'line',
  needleWidth: 3,
  needleCircleOuter: false,
  needleCircleInner: false,
  animateOnInit: 'true',
  animationDuration: 1500,
  animationRule: 'linear',
};

const Template = (args) => <Gauge {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  label: 'Basic Gauge',
  value: 45,
  settings: basicGaugeSettings,
};
Basic.decorators = [muiTheme()];

export const Advanced = Template.bind({});
Advanced.args = {
  label: 'Advanced Gauge',
  value: 30,
  settings: customGauge,
};
Advanced.decorators = [muiTheme()];

export const BasicDarkThemed = Template.bind({});
BasicDarkThemed.args = {
  label: 'Basic Themed Gauge',
  value: 30,
  settings: BasicThemedGauge,
};
BasicDarkThemed.decorators = [muiTheme({ palette: { type: 'dark' } })];

export const AdvancedDarkThemed = Template.bind({});
AdvancedDarkThemed.args = {
  label: 'Advanced Themed Gauge',
  value: 30,
  settings: customGauge,
};
AdvancedDarkThemed.decorators = [muiTheme({ palette: { type: 'dark' } })];
