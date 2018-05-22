import React, { Component } from 'react';
// Material-UI
import Grid from '@material-ui/core/Grid/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
// Recharts
import { BarChart as RechartBarChart, Bar, ResponsiveContainer } from 'recharts';
// Lattice
import Widget from '@lattice/widgets/Widget';
import withMuiStyle from '@lattice/mui-recharts';

const BarChart = withMuiStyle(RechartBarChart);

const data = [
  {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
  {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
  {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
  {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
  {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
  {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
  {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];

const styles = theme => ({
  textItem: {
    textAlign: 'center'
  }
})

class NewCustomers extends Component {

  render () {
    const { className, classes, ...props } = this.props
    return (
      <Widget title="New Customers" featured {...props}>
        <Grid
          container
          alignItems="center"
          justify="space-around"
          className={className}
        >
          <Grid item className={classes.textItem}>
            <Typography variant="display1" color="inherit">{1700}</Typography>
            <Typography variant="caption" color="inherit">New Customers</Typography>
          </Grid>
          <Grid item className={classes.textItem}>
            <Typography variant="display1" color="inherit">+{130}%</Typography>
            <Typography variant="caption" color="inherit">Increment over last month</Typography>
          </Grid>
          <Grid item xs={6}>
            <ResponsiveContainer aspect={2}>
              <BarChart data={data}>
                <Bar dataKey='uv' fill='#8884d8'/>
              </BarChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      </Widget>
    )
  }
}

export default withStyles(styles)(NewCustomers);