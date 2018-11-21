import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
// Material-UI
import Grid from '@material-ui/core/Grid/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography/Typography';
import { withStyles } from '@material-ui/core/styles';

// Lattice
import { Widget } from '@latticejs/widgets';
import { PieChart, Pie, Cell } from '@latticejs/mui-recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const styles = theme => ({
  root: {
    minHeight: 300
  },
  progress: {
    margin: '5px 0'
  },
  ...COLORS.reduce((prev, curr, index) => {
    prev[`color${index}`] = { backgroundColor: curr };
    return prev;
  }, {})
});

class TopProducts extends Component {
  render() {
    const { className, classes, data = [] } = this.props;

    const pieData = data.map(entry => ({
      name: entry.product.name,
      value: entry.total
    }));

    const total = pieData.reduce((total, entry) => total + entry.value, 0);

    return (
      <Widget title={`Top ${pieData.length} Product Sales`}>
        <Grid container alignItems="center" justify="center" className={classnames(className, classes.root)}>
          <Grid item>
            <PieChart width={300} height={300}>
              <Pie data={pieData} dataKey="value" innerRadius={40} fill="#8884d8">
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </Grid>
          <Grid item xs={4}>
            {pieData.map((entry, index) => {
              return (
                <Fragment key={`legend-${index}`}>
                  <Typography variant="subheading">{entry.name}</Typography>
                  <Typography variant="caption">
                    $ {entry.value} - {Math.ceil((entry.value / total) * 100)}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    className={classes.progress}
                    classes={{ barColorPrimary: classes[`color${index}`] }}
                    value={(entry.value / total) * 100}
                  />
                </Fragment>
              );
            })}
          </Grid>
        </Grid>
      </Widget>
    );
  }
}

export default withStyles(styles)(TopProducts);
