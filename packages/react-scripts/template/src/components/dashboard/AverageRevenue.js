import React, { Component } from 'react';
// Material-UI
import Typography from '@material-ui/core/Typography';
// Recharts
import { LineChart as RechartLineChart, Line, ResponsiveContainer } from 'recharts';
// Lattice
import Widget from '@latticejs/widgets/Widget';
import withMuiStyle from '@latticejs/mui-recharts';

const LineChart = withMuiStyle(RechartLineChart);

const data = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 }
];

class AverageRevenue extends Component {
  render() {
    return (
      <Widget title="Average Revenue">
        <ResponsiveContainer aspect={2}>
          <LineChart data={data}>
            <Line variant="monotone" dataKey="pv" stroke="#8884d8" strokeWidth={2} />
            <Line variant="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
        <Typography variant="display1" align="center">
          +{25.9}%
        </Typography>
        <Typography variant="caption" align="center">
          USD {1.2}M
        </Typography>
      </Widget>
    );
  }
}

export default AverageRevenue;
