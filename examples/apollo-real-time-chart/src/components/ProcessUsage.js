import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Badge from '@material-ui/core/Badge';

import { Widget } from '@latticejs/widgets';
import { Pie, PieChart, Cell } from '@latticejs/mui-recharts';
import { Loader } from '@latticejs/widgets';

const styles = theme => ({
  root: {
    height: '100%'
  },
  pid: {
    padding: 5
  },
  content: {
    overflow: 'auto'
  },
  badge: {
    top: 19,
    right: 18.5
  }
});

function UsagePie({ data, usage, classes }) {
  return (
    <Badge badgeContent={Math.floor(usage)} classes={{ badge: classes.badge }} color="primary">
      <PieChart width={60} height={60} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <Pie data={data} dataKey="value" isAnimationActive={false} fill="#8884d8">
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.name === 'free' ? '#0088FE' : '#FF8042'} />
          ))}
        </Pie>
      </PieChart>
    </Badge>
  );
}

function ProcessUsage({ data, loading, classes }) {
  let parsedData = [];

  if (data) {
    parsedData = data.map(ps => {
      const result = {
        ...ps,
        memoryData: [{ name: 'usage', value: ps.memory }, { name: 'free', value: 100 - ps.memory }],
        cpuData: [{ name: 'usage', value: ps.cpu }, { name: 'free', value: 100 - ps.cpu }]
      };

      return result;
    });
  }

  return (
    <Widget title="Top 10 Process" classes={{ content: classes.content, root: classes.root }}>
      <Loader loading={loading}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell numeric>PID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>CPU (%)</TableCell>
              <TableCell>Memory (%)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parsedData.map(ps => {
              return (
                <TableRow key={ps.pid}>
                  <TableCell numeric>{ps.pid}</TableCell>
                  <TableCell>{ps.name}</TableCell>
                  <TableCell>
                    <UsagePie data={ps.cpuData} usage={ps.cpu} classes={classes} />
                  </TableCell>
                  <TableCell>
                    <UsagePie data={ps.memoryData} usage={ps.memory} classes={classes} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Loader>
    </Widget>
  );
}

export default withStyles(styles)(ProcessUsage);
