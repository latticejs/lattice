import React, { Component } from 'react';

// Material-UI
import Grid from 'material-ui/Grid';

// Ours
import AverageRevenue from '../components/dashboard/AverageRevenue';
import NewCustomers from '../components/dashboard/NewCustomers';
import Sales from '../components/dashboard/Sales';
import Stats from '../components/dashboard/Stats';

const stats = [
  { label: 'Followers',
    unit: "New Followers",
    value: 6
  },
  { label: 'Mentions',
    unit: "In last hour",
    value: 38
  },
  { label: 'Revenue',
    unit: "USD",
    value: 92380
  }, 
  { label: 'Visitors',
    unit: "New Visitors",
    value: 289
  }
]
const sales = [
  { name: 'Product A', value: 123245 },
  { name: 'Product B', value: 887237 },
  { name: 'Product C', value: 536551 },
  { name: 'Product D', value: 34323 }
]

export default class Dashboard extends Component {
  render () {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Grid container>
            {
              stats.map((stat, idx) => (
                <Grid key={`stat-${idx}`} item xs={6}  lg={12 / stats.length}> 
                  <Stats stat={stat}/>
                </Grid>
              ))
            }
            <Grid item xs={12}>
                <Sales data={sales}/>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container alignItems="stretch">
            <Grid item xs={12} md={8}>
              <NewCustomers style={{height: '100%'}}/>
            </Grid>
            <Grid item xs={12} md={4}>
              <AverageRevenue />
            </Grid>    
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
