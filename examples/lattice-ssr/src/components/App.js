import React, { Component } from 'react';
import { AppBar, Grid, Toolbar, Typography } from '@material-ui/core';
import { Widget } from '@latticejs/widgets';
import { AreaChart, Area, LineChart, Line, BarChart, Bar } from '@latticejs/mui-recharts';
import Sunburst from '@latticejs/recharts-sunburst';
import { Tree } from '@latticejs/tree';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';

import DayIcon from '@material-ui/icons/WbSunnyOutlined';
import NightIcon from '@material-ui/icons/Brightness3Outlined';

if (!global.window) {
  global.window = {};
}

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flexGrow: 1
  },
  mainContainer: {
    height: '100%'
  },
  widget: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 4,
    minHeight: 160
  },
  charts: {
    padding: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  chartsContainer: {
    minHeight: 500,
    marginTop: theme.spacing.unit * 2
  },
  componentWidget: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 4,
    minHeight: 500,
    minWidth: 385
  }
  // appBar: {
  //   backgroundColor: theme.palette.primary[theme.palette.type],
  //   color: theme.palette.primary.contrastText
  // },
  // mainContainer2: {
  //   backgroundColor: '#898989',
  //   width: 300,
  //   height: 300
  // },
  // mainContainerSB: {
  //   height: 400,
  //   backgroundColor: '#898989'
  // },
  // mainContainerTree: {
  //   width: 500,
  //   height: 400
  // },
  //
  // widget: {
  //   marginTop: theme.spacing.unit * 2,
  //   marginBottom: theme.spacing.unit * 2,
  //   padding: theme.spacing.unit * 4
  // },
  // link: {
  //   color: theme.palette.text.secondary
  // },
  // tableHeadStyle: {
  //   borderBottom: 0
  // },
  // tableCellStyle: {
  //   borderBottom: 0,
  //   width: 400
  // }
});

class App extends Component {
  constructor(props) {
    super(props);

    this.getTreeData = this.getTreeData.bind(this);
    this.getSunburstData = this.getSunburstData.bind(this);
    this.getGraphData = this.getGraphData.bind(this);

    this.state = {
      items: Array.from(Array(100).keys()).map(v => ({ index: v, title: `title ${v}`, timestamp: Date.now() }))
    };
  }
  handleNightModeChange = () => {
    const { updateTheme, nightMode } = this.props;
    updateTheme(!nightMode);
  };

  getSunburstData() {
    return [
      {
        children: [
          { name: 'Data', size: 20544 },
          { name: 'DataList', size: 19788 },
          { name: 'DataSprite', size: 10349 },
          { name: 'EdgeSprite', size: 3301 },
          { name: 'NodeSprite', size: 19382 },
          {
            name: 'render',
            children: [
              { name: 'ArrowType', size: 698 },
              { name: 'EdgeRenderer', size: 5569 },
              { name: 'IRenderer', size: 353 },
              { name: 'ShapeRenderer', size: 2247 }
            ]
          },
          { name: 'ScaleBinding', size: 11275 },
          { name: 'Tree', size: 7147 },
          { name: 'TreeBuilder', size: 9930 }
        ]
      }
    ];
  }

  getGraphData() {
    return [
      { name: 'Page A', pv: 2400, amt: 2400 },
      { name: 'Page B', pv: 1398, amt: 2210 },
      { name: 'Page C', pv: 9800, amt: 2290 },
      { name: 'Page D', pv: 3908, amt: 2000 },
      { name: 'Page E', pv: 4800, amt: 2181 },
      { name: 'Page F', pv: 3800, amt: 2500 },
      { name: 'Page G', pv: 4300, amt: 2100 }
    ];
  }

  getTreeData() {
    return [
      {
        label: 'index.js'
      },
      {
        label: 'demo',
        children: [
          {
            label: 'file1.txt'
          },
          {
            label: 'file2.txt'
          },
          {
            label: 'examples',
            children: [
              {
                label: 'example1.js'
              }
            ]
          }
        ]
      }
    ];
  }

  render() {
    const { classes, nightMode } = this.props;
    const sunburstData = this.getSunburstData();
    const treeData = this.getTreeData();
    const rechartsData = this.getGraphData();
    // let color = '#898989';
    //
    // if (nightMode) {
    //   color = '#424242';
    // }

    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              Server Side Rendering of Lattice Packages
            </Typography>
            <Tooltip title="Toggle Night Mode" enterDelay={300}>
              <IconButton onClick={this.handleNightModeChange} color="inherit">
                {nightMode ? <DayIcon /> : <NightIcon />}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Grid container className={classes.mainContainer}>
          <Grid item xs={12}>
            <Grid container justify="space-around" spacing={Number('16')} alignItem="center">
              <Grid item>
                <Widget className={classes.widget} title="Introduction" border="bottom">
                  <Typography variant="subtitle2">Welcome to Lattice</Typography>
                </Widget>
              </Grid>
              <Grid item>
                <Widget className={classes.widget} title="Isomorphic" border="bottom">
                  <Typography variant="subtitle2">Server Side Rendering</Typography>
                </Widget>
              </Grid>
              <Grid item>
                <Widget className={classes.widget} title="Material UI" border="bottom">
                  <Typography variant="subtitle2">With Material UI</Typography>
                </Widget>
              </Grid>
              <Grid item>
                <Widget className={classes.widget} title="D3" border="bottom">
                  <Typography variant="subtitle2">Recharts + Sunburst</Typography>
                </Widget>
              </Grid>
              <Grid item>
                <Widget className={classes.widget} title="React Virtualized" border="bottom">
                  <Typography variant="subtitle2">Tree Component</Typography>
                </Widget>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container className={classes.mainContainer}>
          <Grid item xs={12}>
            <Grid container justify="space-around" spacing={8}>
              <Grid item className={classes.componentClasses}>
                <Widget className={classes.componentWidget} border="bottom">
                  <Sunburst
                    data={sunburstData}
                    dataKey="size"
                    fill="#00C49F"
                    stroke="#fff"
                    isAnimationActive={false}
                    animationBegin={0}
                    animationDuration={0}
                    width={400}
                    height={400}
                  />
                </Widget>
              </Grid>
              <Grid item>
                <Grid
                  className={classes.chartsContainer}
                  container
                  alignItem="center"
                  justify="center"
                  spacing={0}
                  direction="column"
                >
                  <Grid item>
                    <Widget className={classes.charts} border="bottom">
                      <LineChart width={300} height={80} data={rechartsData}>
                        <Line type="monotone" dataKey="pv" strokeWidth={3} isAnimationActive={false} />
                      </LineChart>
                    </Widget>
                  </Grid>
                  <Grid item>
                    <Widget className={classes.charts} border="bottom">
                      <BarChart width={300} height={80} data={rechartsData}>
                        <Bar type="monotone" dataKey="pv" strokeWidth={3} isAnimationActive={false} />
                      </BarChart>
                    </Widget>
                  </Grid>
                  <Grid item>
                    <Widget className={classes.charts} border="bottom">
                      <AreaChart width={300} height={80} data={rechartsData}>
                        <Area type="monotone" dataKey="pv" strokeWidth={3} isAnimationActive={false} />
                      </AreaChart>
                    </Widget>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Widget className={classes.componentWidget} border="bottom">
                  <Tree
                    treeData={treeData}
                    cascadeCheck
                    onCheckItem={item => console.log('Check: ', item)}
                    onUnfoldItem={item => console.log('Unfold: ', item)}
                    onFoldItem={item => console.log('Fold: ', item)}
                  />
                </Widget>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(App);
