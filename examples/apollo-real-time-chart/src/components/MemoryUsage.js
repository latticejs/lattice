import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { ResponsiveContainer, BarChart, Bar, Tooltip, Legend, YAxis } from '@latticejs/mui-recharts';
import { Loader, Widget } from '@latticejs/widgets';

const styles = theme => ({
  root: {
    height: '100%'
  }
});

const CustomTooltip = ({ payload }) => {
  if (payload.length === 0) {
    return null;
  }

  return (
    <Widget>
      <Grid container justify="center" alignItems="center" direction="column" spacing={8}>
        <Grid item>
          <Typography variant="body1">
            Usage: <strong>{`${payload[0].value} MB`}</strong>
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">
            Free: <strong>{`${payload[1].value} MB`}</strong>
          </Typography>
        </Grid>
      </Grid>
    </Widget>
  );
};

function MemoryUsage({ data, loading, classes }) {
  let parsedData = [];
  let total = 0;

  if (data) {
    let { usage, total: dataTotal } = data.latest;
    usage = Math.floor(usage / (1024 * 1024));
    total = Math.floor(dataTotal / (1024 * 1024));
    let free = total - usage;

    parsedData = [
      {
        usage,
        free
      }
    ];
  }

  return (
    <Widget title="Platform" classes={classes}>
      <Loader loading={loading}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={parsedData}>
            <Tooltip content={<CustomTooltip />} />
            <YAxis type="number" domain={[0, total]} />
            <Legend verticalAlign="top" height={36} />
            <Bar isAnimationActive={false} dataKey="usage" fill="#8884d8" />
            <Bar isAnimationActive={false} dataKey="free" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Loader>
    </Widget>
  );
}

export default withStyles(styles)(MemoryUsage);
