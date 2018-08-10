import React from 'react';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';

import Widget from './Widget';
import { ResponsiveContainer, LineChart, Line, YAxis, Legend, Tooltip } from '@latticejs/mui-recharts';
import { Loader } from '@latticejs/widgets';

const styles = theme => ({
  root: {
    height: '100%'
  },
  initial: {
    color: theme.palette.text.secondary
  }
});

function CPUUsage({ data, loading, classes }) {
  let parsedData = [];

  if (data) {
    parsedData = data.history.map(h => {
      const result = {};

      h.cpusUsage.forEach((cpuUsage, key) => {
        result[`cpu-${key}`] = cpuUsage.toFixed(2);
      });

      return result;
    });
  }

  return (
    <Widget title="CPU Usage" className={classNames(classes.root, classes.initial)}>
      <Loader loading={loading}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={parsedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <YAxis type="number" domain={[0, 100]} />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Line dataKey="cpu-0" dot={false} stroke="#8884d8" strokeWidth={3} isAnimationActive={false} />
            <Line dataKey="cpu-1" dot={false} stroke="#82ca9d" strokeWidth={3} isAnimationActive={false} />
            <Line dataKey="cpu-2" dot={false} stroke="#ffc658" strokeWidth={3} isAnimationActive={false} />
            <Line dataKey="cpu-3" dot={false} stroke="#ef843c" strokeWidth={3} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </Loader>
    </Widget>
  );
}

export default withStyles(styles)(CPUUsage);
