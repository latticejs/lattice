import React, { Component } from 'react';
import { RadialGauge } from 'canvas-gauges';
import { withTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

class Gauge extends Component {
  componentDidMount() {
    const { value, settings, theme } = this.props;
    settings.value = settings.value && !value ? settings.value : value;
    const options = { ...settings, renderTo: this.el };

    options.fontValue = theme.typography.fontFamily;
    options.fontNumbers = theme.typography.fontFamily;
    options.fontUnits = theme.typography.fontFamily;

    options.colorBarProgress = theme.palette.primary[theme.palette.type];
    options.colorNeedle = theme.palette.secondary[theme.palette.type];
    options.colorNeedleEnd = theme.palette.secondary[theme.palette.type];
    options.colorValueText = theme.palette.text.primary;

    options.colorTitle = theme.palette.text.secondary;
    options.colorUnits = theme.palette.text.secondary;
    options.colorMinorTicks = theme.palette.text.secondary;

    if (theme.palette.type === 'light') {
      options.colorBar = theme.palette.grey['300'];
      options.colorNumbers = options.colorNumbers !== 'transparent' ? theme.palette.text.primary : options.colorNumbers;
      options.colorMajorTicks =
        options.colorMajorTicks !== 'transparent' ? theme.palette.text.primary : options.colorMajorTicks;
      options.colorPlate = options.colorPlate !== 'transparent' ? theme.palette.grey['50'] : options.colorPlate;
    } else if (theme.palette.type === 'dark') {
      options.colorBarProgress = theme.palette.secondary[theme.palette.type];
      options.colorNeedle = theme.palette.primary[theme.palette.type];
      options.colorNeedleEnd = theme.palette.primary[theme.palette.type];
      options.colorBar = theme.palette.grey['500'];
      options.colorNumbers =
        options.colorNumbers !== 'transparent' ? theme.palette.text.secondary : options.colorNumbers;
      options.colorMajorTicks =
        options.colorMajorTicks !== 'transparent' ? theme.palette.text.secondary : options.colorMajorTicks;
      options.colorPlate = options.colorPlate !== 'transparent' ? theme.palette.grey['700'] : options.colorPlate;
    }
    this.gauge = new RadialGauge(options).draw();
  }

  componentDidUpdate(prevProps) {
    this.gauge.value = prevProps.value;
    this.gauge.update(prevProps);
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

Gauge.defaultProps = {
  settings: {
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
    animationDuration: 1500
  }
};

Gauge.propTypes = {
  settings: PropTypes.object,
  value: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired
};

export default withTheme(Gauge);
