import React from 'react';
import * as recharts from 'recharts';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
  return {
    rootChart: {
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize,
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.paper,
    },
  };
});

export const MuiRecharts = (props) => {
  const styleClasses = useStyles();
  const theme = useTheme();
  const applyStyleFor = (element) => {
    const {
      type: { displayNames },
    } = element; // TODO: check this in prod build
    switch (displayNames) {
      case 'Tooltip': {
        const {
          props: { wrapperStyle },
        } = element;

        return {
          wrapperStyle: {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.secondary,
            border: 'none',
            boxShadow: theme.shadows[1],
            ...wrapperStyle,
          },
        };
      }
      case 'XAxis':
      case 'YAxis':
      case 'ZAxis':
      case 'PolarAngleAxis':
      case 'PolarRadiusAxis': {
        const {
          props: { stroke },
        } = element;
        return {
          stroke: stroke || theme.palette.text.secondary,
        };
      }
      default:
        return {};
    }
  };

  const RenderStyled = (children) => {
    return React.Children.map(children, (child) =>
      React.cloneElement(child, {
        ...applyStyleFor(child),
      })
    );
  };

  const { classes, children, WrappedChart, data, ...rest } = props;
  return (
    <WrappedChart data={data} theme={theme} height={575} width={1572} {...rest} className={styleClasses.rootChart}>
      {RenderStyled(children)}
    </WrappedChart>
  );
};

export const LineChart = recharts.LineChart;
export const BarChart = recharts.BarChart;
export const PieChart = recharts.PieChart;
export const Treemap = recharts.Treemap;
export const Sankey = recharts.Sankey;
export const RadarChart = recharts.RadarChart;
export const ScatterChart = recharts.ScatterChart;
export const AreaChart = recharts.AreaChart;
export const RadialBarChart = recharts.RadialBarChart;
export const ComposedChart = recharts.ComposedChart;

export const Surface = recharts.Surface;
export const Layer = recharts.Layer;
export const Legend = recharts.Legend;
export const Tooltip = recharts.Tooltip;
export const ResponsiveContainer = recharts.ResponsiveContainer;
export const Cell = recharts.Cell;
export const Text = recharts.Text;
export const Label = recharts.Label;
export const LabelList = recharts.LabelList;
export const Sector = recharts.Sector;
export const Curve = recharts.Curve;
export const Rectangle = recharts.Rectangle;
export const Polygon = recharts.Polygon;
export const Dot = recharts.Dot;
export const Cross = recharts.Cross;
export const Symbols = recharts.Symbols;
export const PolarGrid = recharts.PolarGrid;
export const PolarRadiusAxis = recharts.PolarRadiusAxis;
export const PolarAngleAxis = recharts.PolarAngleAxis;
export const Pie = recharts.Pie;
export const Radar = recharts.Radar;
export const RadialBar = recharts.RadialBar;
export const Brush = recharts.Brush;
export const ReferenceLine = recharts.ReferenceLine;
export const ReferenceDot = recharts.ReferenceDot;
export const ReferenceArea = recharts.ReferenceArea;
export const CartesianAxis = recharts.CartesianAxis;
export const CartesianGrid = recharts.CartesianGrid;
export const Line = recharts.Line;
export const Area = recharts.Area;
export const Bar = recharts.Bar;
export const Scatter = recharts.Scatter;
export const XAxis = recharts.XAxis;
export const YAxis = recharts.YAxis;
export const ZAxis = recharts.ZAxis;
export const ErrorBar = recharts.ErrorBar;
