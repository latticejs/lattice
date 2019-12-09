import React, { Component } from 'react';
// Material-UI
import { AppBar, IconButton, Grid, Toolbar, Tooltip, Tab, Tabs, Typography } from '@material-ui/core';
import httpHelper from './helper/httpHelper';
import LatticeAgGrid from '@latticejs/ag-grid';
import '@latticejs/ag-grid/styles/lattice-ag-grid-style.css';
import { withStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';
import PieChartIcon from '@material-ui/icons/PieChart';
import GridOnIcon from '@material-ui/icons/GridOn';
import MapIcon from '@material-ui/icons/Map';
import Box from '@material-ui/core/Box';

// Material icons
import DayIcon from '@material-ui/icons/WbSunnyOutlined';
import NightIcon from '@material-ui/icons/Brightness3Outlined';

import 'typeface-roboto';

// Custom Style
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
  widget: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(4)
  },
  link: {
    color: theme.palette.text.secondary
  }
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`
  };
}

class App extends Component {
  constructor(props) {
    super(props);
    this.gotData = this.gotData.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
    this.getGrid = this.getGrid.bind(this);
    this.handleNightModeChange = this.handleNightModeChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      selectedTab: 0,
      columnDefs: [
        {
          headerName: 'Name',
          field: 'name',
          pinned: true,
          filter: 'agTextColumnFilter',
          rowDrag: true,
          checkboxSelection: true
        },
        {
          headerName: 'Native Name',
          field: 'nativeName',
          filter: 'agTextColumnFilter'
        },
        {
          headerName: 'Capital',
          field: 'capital',
          filter: 'agTextColumnFilter'
        },
        {
          headerName: 'Population',
          field: 'population',
          filter: 'agNumberColumnFilter'
        },
        {
          headerName: 'Region Info',
          children: [
            {
              headerName: 'Region',
              field: 'region',
              filter: 'agTextColumnFilter'
            },
            {
              headerName: 'Sub-Region',
              field: 'subregion',
              filter: 'agTextColumnFilter'
            },
            {
              headerName: 'Area',
              field: 'area',
              filter: 'agNumberColumnFilter'
            }
          ]
        }
      ],
      rowData: [],
      showPagination: false
    };
  }

  componentDidMount() {
    const httpObj = {
      url: '/all?fields=name;capital;currencies;region;subregion;area;nativeName;languages;timezones;population',
      method: 'get'
    };
    httpHelper(httpObj, this.gotData);
  }

  gotData({ data }) {
    this.setState({ rowData: data });
    console.log(this.state.rowData);
  }

  handlePagination() {
    this.setState({ showPagination: !this.state.showPagination });
  }

  getGrid(gridObj) {
    console.log('m here');
    console.log(gridObj);
  }

  handleNightModeChange() {
    const { updateTheme, nightMode } = this.props;
    updateTheme(!nightMode);
  }

  handleChange(event, newTab) {
    this.setState({
      selectedTab: newTab
    });
  }

  render() {
    const { classes, nightMode } = this.props;
    const { columnDefs, rowData, showPagination } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              Reacharts, Ag-Grid, Map Example
            </Typography>
            <Tooltip title="Toggle Night Mode" enterDelay={300}>
              <IconButton onClick={this.handleNightModeChange} color="inherit">
                {nightMode ? <DayIcon /> : <NightIcon />}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.selectedTab}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            aria-label="scrollable force tabs example"
          >
            <Tab label="Rechart" icon={<PieChartIcon />} {...a11yProps(0)} />
            <Tab label="Ag-Grid" icon={<GridOnIcon />} {...a11yProps(1)} />
            <Tab label="Map" icon={<MapIcon />} {...a11yProps(2)} />
          </Tabs>
        </AppBar>
        <TabPanel value={this.state.selectedTab} index={0}>
          Rechart
        </TabPanel>
        <TabPanel value={this.state.selectedTab} index={1}>
          <Grid container>
            <LatticeAgGrid
              animateRows
              enableSorting
              enableFilter
              enableColResize
              rowDragManaged={!showPagination}
              pagination={showPagination}
              paginationAutoPageSize={showPagination}
              columnDefs={columnDefs}
              rowData={rowData}
              rowSelection="multiple"
              afterGridCreated={this.getGrid}
              gridContainerStyle={{
                height: window.innerHeight
              }}
            />
          </Grid>
        </TabPanel>
        <TabPanel value={this.state.selectedTab} index={2}>
          Map
        </TabPanel>
      </div>
    );
  }
}

export default withStyles(styles)(App);
