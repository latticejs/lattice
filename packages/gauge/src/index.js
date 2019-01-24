import React from 'react';
import { RadialGauge } from 'canvas-gauges';
import { withTheme } from '@material-ui/core/styles';

class RadialGaugeComponent extends React.Component {
  componentDidMount() {
    let GaugeParams = this.props;
    const { theme } = GaugeParams;
    const isObjectEmpty = Object.entries(GaugeParams).length === 1 && GaugeParams.constructor === Object;
    if (isObjectEmpty) {
      GaugeParams = {
        width: 250,
        height: 250,
        minValue: 0,
        value: 30,
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
        animationDuration: 1500
      };
    }

    const options = Object.assign({}, GaugeParams, {
      renderTo: this.el
    });

    options.fontValue = theme.typography.fontFamily;
    options.fontNumbers = theme.typography.fontFamily;
    options.fontUnits = theme.typography.fontFamily;
    if (theme.palette.type === 'light') {
      options.colorBarProgress = theme.palette.primary.light;
      options.colorBar = theme.palette.grey['300'];
      options.colorNeedle = theme.palette.secondary.light;
      options.colorNeedleEnd = theme.palette.secondary.light;
      options.colorValueText = theme.palette.text.primary;
      options.colorNumbers = options.colorNumbers !== 'transparent' ? theme.palette.text.primary : options.colorNumbers;
      options.colorTitle = theme.palette.text.primary;
      options.colorUnits = theme.palette.text.primary;
      options.colorMinorTicks = theme.palette.text.primary;
      options.colorMajorTicks =
        options.colorMajorTicks !== 'transparent' ? theme.palette.text.primary : options.colorMajorTicks;
      options.colorPlate = options.colorPlate !== 'transparent' ? theme.palette.grey['50'] : options.colorPlate;
    } else if (theme.palette.type === 'dark') {
      options.colorBarProgress = theme.palette.primary.dark;
      options.colorBar = theme.palette.grey['500'];
      options.colorNeedle = theme.palette.secondary.dark;
      options.colorNeedleEnd = theme.palette.secondary.dark;
      options.colorValueText = theme.palette.text.secondary;
      options.colorNumbers =
        options.colorNumbers !== 'transparent' ? theme.palette.text.secondary : options.colorNumbers;
      options.colorTitle = theme.palette.text.secondary;
      options.colorUnits = theme.palette.text.secondary;
      options.colorMinorTicks = theme.palette.text.secondary;
      options.colorMajorTicks =
        options.colorMajorTicks !== 'transparent' ? theme.palette.text.secondary : options.colorMajorTicks;
      options.colorPlate = options.colorPlate !== 'transparent' ? theme.palette.grey['900'] : options.colorPlate;
    }
    this.gauge = new RadialGauge(options).draw();
  }

  componentWillReceiveProps(nextProps) {
    this.gauge.value = nextProps.value;
    this.gauge.update(nextProps);
  }

  render() {
    return (
      <canvas
        ref={canvas => {
          this.el = canvas;
        }}
      />
    );
  }
}

export default withTheme()(RadialGaugeComponent);
