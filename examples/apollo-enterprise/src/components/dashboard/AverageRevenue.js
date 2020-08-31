import React from 'react';
// Material-UI
import Typography from '@material-ui/core/Typography';

// Lattice
import { LineChart, Line, ResponsiveContainer } from '@latticejs/mui-recharts';
import { Widget } from '@latticejs/widgets';
import Grid from '@material-ui/core/Grid';

const data = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 }
];


const averageRevenue = () => {
  return (
    <Widget title="Average Revenue">
      <Grid container>
        <ResponsiveContainer aspect={2} height="85%">
          <LineChart data={data}>
            <Line variant="monotone" dataKey="pv" stroke="#8884d8" strokeWidth={2} />
            <Line variant="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
        <Grid container>
          <Typography variant="h4" align="center">
            +25.9%
          </Typography>
          <Typography variant="caption" align="center">
            USD 1.2M
          </Typography>
        </Grid>
      </Grid>
    </Widget>
  );
}

export default averageRevenue;
