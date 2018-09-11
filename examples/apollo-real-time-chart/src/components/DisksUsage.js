import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import { Widget } from '@latticejs/widgets';
import { ResponsiveContainer, AreaChart, Area, YAxis, Legend, Tooltip } from '@latticejs/mui-recharts';
import { Loader } from '@latticejs/widgets';

const styles = theme => ({
  root: {
    height: '100%'
  }
});

function DiskUsage({ data, loading, classes }) {
  let parsedData = [];

  if (data) {
    parsedData = data.history.map(h => ({
      reads: parseFloat(h.reads.toFixed(2)),
      writes: parseFloat(h.writes.toFixed(2))
    }));
  }

  return (
    <Widget title="Disk IO" classes={classes}>
      <Loader loading={loading}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={parsedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <YAxis type="number" label={{ value: 'ops/sec', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Area dataKey="reads" fill="#8884d8" stroke="#8884d8" isAnimationActive={false} />
            <Area dataKey="writes" fill="#ffc658" stroke="#ffc658" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Loader>
    </Widget>
  );
}

export default withStyles(styles)(DiskUsage);
