import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Widget from './Widget';
import { ResponsiveContainer, LineChart, Line, YAxis, Legend, Tooltip } from '@latticejs/mui-recharts';
import { Loader } from '@latticejs/widgets';

const styles = theme => ({
  root: {
    height: '100%'
  }
});

const colors = ['#1769aa', '#ab003c', '#4dabf5', '#ff3d00', '#4caf50', '#ff9800', '#f44336', '#9c27b0'];

function CPUUsage({ data, loading, classes, cores }) {
  let parsedData = [];

  if (data) {
    parsedData = data.history.map(h => {
      const result = {};

      h.cpusUsage.forEach((cpuUsage, key) => {
        result[`cpu-${key}`] = parseFloat(cpuUsage.toFixed(2));
      });

      return result;
    });
  }

  return (
    <Widget title="CPU Usage" className={classes.root}>
      <Loader loading={loading}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={parsedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <YAxis type="number" domain={[0, 100]} />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            {[...Array(cores).keys()].map(c => (
              <Line
                key={c}
                dataKey={`cpu-${c}`}
                dot={false}
                stroke={colors[c]}
                strokeWidth={3}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Loader>
    </Widget>
  );
}

export default withStyles(styles)(CPUUsage);
