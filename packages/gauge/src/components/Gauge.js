import React, { useRef, useEffect } from 'react';
import { RadialGauge } from 'canvas-gauges';
import PropTypes from 'prop-types';
import { useTheme, makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => {
  return {
    '@global': {
      '[id^="story--example-gauge"][id$="dark-themed"]': {
        backgroundColor: theme.palette.background.paper,
      },
    },
    rootChart: {
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize,
      color: theme.palette.text.primary,
    },
  };
});

export const Gauge = ({ ...props }) => {
  const { value, settings } = props;
  const theme = useTheme();
  settings.value = settings.value && !value ? settings.value : value;
  const ref = useRef(null);
  const styleClasses = styles();

  let gauge;

  useEffect(() => {
    if (!ref.current) return;
    const options = { ...settings, renderTo: ref.current };
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

    gauge = new RadialGauge(options).draw();
  }, [ref.current]);

  useEffect(() => {
    if (gauge) {
      gauge.value = props.value;
      gauge.update(props);
    }
  }, [props, gauge]);

  return (
    <canvas
      ref={(canvas) => {
        if (canvas) {
          ref.current = canvas;
        }
      }}
      className={styleClasses.rootChart}
    />
  );
};

Gauge.propTypes = {
  settings: PropTypes.object,
  label: PropTypes.string.isRequired,
  theme: PropTypes.object,
};
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
    animationDuration: 1500,
  },
};
