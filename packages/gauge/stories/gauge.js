import React, { Component } from 'react';

// Ours
import Gauge from '../src/';
import muiTheme from '../.storybook/decorator-material-ui';
import { withReadme } from '@latticejs/storybook-readme';
import { Paper } from '@material-ui/core';
import Readme from '../README.md';

const Flexed = story => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>{story()}</div>
);

const FullViewport = story => <div style={{ height: '100vh', width: '100vw', padding: 12 }}>{story()}</div>;

const PaperWrap = ({ children }) => (
  <Paper elevation={2} style={{ width: '800px', height: '800px' }}>
    {children}
  </Paper>
);

class BasicGauge extends Component {
  render() {
    return <Gauge value={45} />;
  }
}

class AdvancedGauge extends Component {
  constructor() {
    super();
    this.customGauge = {
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
      colorValueBoxBackground: 'transparent'
    };
  }
  render() {
    return <Gauge value={30} settings={this.customGauge} />;
  }
}

class BasicThemedGauge extends Component {
  constructor() {
    super();
    this.customGauge = {
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
      animationRule: 'linear'
    };
  }
  render() {
    return <Gauge value={30} settings={this.customGauge} />;
  }
}

class AdvancedThemedGauge extends Component {
  constructor() {
    super();
    this.customGauge = {
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
      colorValueBoxBackground: 'transparent'
    };
  }
  render() {
    return <Gauge value={30} settings={this.customGauge} />;
  }
}

const loadReadmeSections = withReadme(Readme);
const withApiReadme = loadReadmeSections(['api']);

export default ({ storiesOf }) => {
  storiesOf('gauge', module)
    .addDecorator(Flexed)
    .addDecorator(muiTheme())
    .addDecorator(FullViewport)
    .add('basic', withApiReadme(() => <BasicGauge />));

  storiesOf('gauge', module)
    .addDecorator(Flexed)
    .addDecorator(muiTheme())
    .addDecorator(FullViewport)
    .add('advanced', withApiReadme(() => <AdvancedGauge />));

  storiesOf('gauge/themed', module)
    .addDecorator(Flexed)
    .addDecorator(muiTheme({ palette: { type: 'dark' } }))
    .addDecorator(FullViewport)
    .add(
      'basic (dark)',
      withApiReadme(() => (
        <PaperWrap>
          <BasicThemedGauge />
        </PaperWrap>
      ))
    );

  storiesOf('gauge/themed', module)
    .addDecorator(Flexed)
    .addDecorator(muiTheme({ palette: { type: 'dark' } }))
    .addDecorator(FullViewport)
    .add(
      'advanced (dark)',
      withApiReadme(() => (
        <PaperWrap>
          <AdvancedThemedGauge />
        </PaperWrap>
      ))
    );
};
