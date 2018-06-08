import React, { Component } from 'react';
import * as recharts from 'recharts';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  rootChart: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    color: theme.palette.text.primary
  }
});

export const withMuiStyle = WrappedChart => {
  return withStyles(styles, { withTheme: true })(
    class extends Component {
      static displayName = `MuiRechart(${WrappedChart.displayName || WrappedChart.name})`;

      applyStyleFor(element) {
        const { theme } = this.props;
        const {
          type: { displayName }
        } = element; // TODO: check this in prod build

        switch (displayName) {
          case 'Tooltip': {
            const {
              props: { wrapperStyle }
            } = element;
            return {
              wrapperStyle: {
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.secondary,
                border: 'none',
                boxShadow: theme.shadows[1],
                ...wrapperStyle
              }
            };
          }
          case 'XAxis':
          case 'YAxis':
          case 'ZAxis':
          case 'PolarAngleAxis':
          case 'PolarRadiusAxis': {
            const {
              props: { stroke }
            } = element;
            return {
              stroke: stroke || theme.palette.text.secondary
            };
          }
          default:
            return {};
        }
      }

      renderStyled(children) {
        return React.Children.map(children, child =>
          React.cloneElement(child, {
            ...this.applyStyleFor(child)
          })
        );
      }

      render() {
        const { classes, children } = this.props;
        return (
          <WrappedChart {...this.props} className={classes.rootChart}>
            {this.renderStyled(children)}
          </WrappedChart>
        );
      }
    }
  );
};

export const LineChart = withMuiStyle(recharts.LineChart);
export const BarChart = withMuiStyle(recharts.BarChart);
export const PieChart = withMuiStyle(recharts.PieChart);
export const Treemap = withMuiStyle(recharts.Treemap);
export const Sankey = withMuiStyle(recharts.Sankey);
export const RadarChart = withMuiStyle(recharts.RadarChart);
export const ScatterChart = withMuiStyle(recharts.ScatterChart);
export const AreaChart = withMuiStyle(recharts.AreaChart);
export const RadialBarChart = withMuiStyle(recharts.RadialBarChart);
export const ComposedChart = withMuiStyle(recharts.ComposedChart);

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
