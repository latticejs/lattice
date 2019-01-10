import React from 'react';
import { RadialGauge } from 'canvas-gauges';

class RadialGaugeComponent extends React.Component {
  componentDidMount() {
    const options = Object.assign({}, this.props, {
      renderTo: this.el
    });

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

RadialGaugeComponent.defaultProps = {
  fontValue: 'Roboto, sans-serif',
  fontNumbers: 'Roboto, sans-serif',
  fontUnits: 'Roboto, sans-serif',
  value: 30,
  units: 'mph',
  width: 300,
  height: 300,
  barWidth: '5',
  barShadow: '0',
  colorBarProgress: '#3f51b5',
  colorBar: '#c5cbe9',
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
  colorNeedle: '#e91f62',
  needleType: 'arrow',
  colorValueBoxBackground: 'transparent'
};

export default RadialGaugeComponent;
