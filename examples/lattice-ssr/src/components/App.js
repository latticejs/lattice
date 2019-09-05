import React, { Component } from 'react';
import { AppBar, Grid, Toolbar, Typography } from '@material-ui/core';
import classnames from 'classnames';
import { Widget } from '@latticejs/widgets';
import { LineChart, Line } from '@latticejs/mui-recharts';
import Sunburst from '@latticejs/recharts-sunburst';
import { Tree } from '@latticejs/tree';
import { withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableRow, TableCell } from '@latticejs/infinite-list';

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
  appBar: {
    backgroundColor: theme.palette.primary[theme.palette.type],
    color: theme.palette.primary.contrastText
  },
  mainContainer2: {
    backgroundColor: '#898989',
    width: 300,
    height: 300
  },
  mainContainerSB: {
    height: 400,
    backgroundColor: '#898989'
  },
  mainContainerTree: {
    width: 500,
    height: 400
  },
  mainContainerLC: {
    backgroundColor: '#898989',
    paddingTop: '4%',
    width: '100%',
    height: 150
  },
  mainContainer: {
    backgroundColor: '#898989',
    height: '100%'
  },
  widget: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 4
  },
  link: {
    color: theme.palette.text.secondary
  },
  tableHeadStyle: {
    borderBottom: 0
  },
  tableCellStyle: {
    borderBottom: 0,
    width: 400
  }
});

class App extends Component {
  constructor(props) {
    super(props);

    this.getTreeData = this.getTreeData.bind(this);
    this.getSunburstData = this.getSunburstData.bind(this);
    this.getLineData = this.getLineData.bind(this);

    this.renderBody = this.renderBody.bind(this);
    this.findItem = this.findItem.bind(this);
    this.delay = this.delay.bind(this);
    this.loadMore = this.loadMore.bind(this);

    this.state = {
      items: Array.from(Array(100).keys()).map(v => ({ index: v, title: `title ${v}`, timestamp: Date.now() }))
    };
  }

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

  getLineData() {
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

  renderBody({ item, isEmpty, key, style }) {
    const { classes } = this.props;

    if (isEmpty) {
      return <h4>Empty list</h4>;
    }

    if (!item) {
      return (
        <TableRow key={key} style={style}>
          <TableCell>loading...</TableCell>
        </TableRow>
      );
    }

    style.width = 1000;

    return (
      <TableRow key={key} style={style}>
        <TableCell classes={{ root: classes.tableCellStyle }}>{item.index}</TableCell>
        <TableCell classes={{ root: classes.tableCellStyle }}>{item.title}</TableCell>
        <TableCell classes={{ root: classes.tableCellStyle }}>{item.timestamp}</TableCell>
      </TableRow>
    );
  }

  findItem({ index }) {
    return this.state.items.find(i => i.index === index);
  }

  delay(time) {
    new Promise(resolve => setTimeout(resolve, time));
  }

  loadMore({ startIndex, stopIndex }) {
    // await this.delay(500);

    this.setState(state => {
      const newItems = Array.from(Array(stopIndex - startIndex + 1).keys()).map(v => ({
        index: startIndex + v,
        title: `title ${startIndex + v}`,
        timestamp: Date.now()
      }));

      return { items: [...state.items, ...newItems] };
    });
  }

  render() {
    const { classes } = this.props;
    const sunburstData = this.getSunburstData();
    const treeData = this.getTreeData();
    const rechartsLineData = this.getLineData();

    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              Server Side Rendering of Lattice Packages
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container className={classes.mainContainer}>
          <Grid item xs={12}>
            <Grid container justify="space-around" spacing={Number('16')}>
              <Grid item>
                <Widget className={classes.widget} title="Introduction" border="bottom">
                  <Typography variant="subtitle2">Welcome to Lattice</Typography>
                </Widget>
              </Grid>
              <Grid item>
                <Widget className={classes.widget} title="Material" border="bottom">
                  <Typography variant="subtitle2">Material UI integration</Typography>
                </Widget>
              </Grid>
              <Grid item>
                <Widget className={classes.widget} title="Recharts" border="bottom">
                  <Typography variant="subtitle2">with Material style</Typography>
                </Widget>
              </Grid>
              <Grid item>
                <Widget className={classes.widget} title="D3" border="bottom">
                  <Typography variant="subtitle2">React + D3 integration</Typography>
                </Widget>
              </Grid>
              <Grid item>
                <Widget className={classes.widget} title="React Virtualized" border="bottom">
                  <Typography variant="subtitle2">Infinite list support</Typography>
                </Widget>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Widget title="MUI Recharts">
          <center className={classnames(classes.mainContainerLC)}>
            <LineChart width={300} height={100} data={rechartsLineData}>
              <Line type="monotone" dataKey="pv" stroke="#8884d8" strokeWidth={2} isAnimationActive={false} />
            </LineChart>
          </center>
        </Widget>
        <Grid container className={classes.mainContainer}>
          <Grid item xs={12}>
            <Widget title="Recharts Sunburst">
              <center className={classnames(classes.mainContainerSB)}>
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
              </center>
            </Widget>
          </Grid>
        </Grid>
        <Widget title="Tree">
          <Tree
            treeData={treeData}
            cascadeCheck
            onCheckItem={item => console.log('Check: ', item)}
            onUnfoldItem={item => console.log('Unfold: ', item)}
            onFoldItem={item => console.log('Fold: ', item)}
          />
        </Widget>
        <Widget title="Infinite List">
          <Table>
            <TableBody
              loadMore={this.loadMore}
              findItem={this.findItem}
              list={this.state.items}
              rowCount={1000}
              rowHeight={48}
              height={300}
              width={window && window.innerWidth ? window.innerWidth - 50 : 1000}
              rvInfiniteLoaderProps={{ minimumBatchSize: 24 }}
            >
              {this.renderBody}
            </TableBody>
          </Table>
        </Widget>
      </div>
    );
  }
}

export default withStyles(styles)(App);
