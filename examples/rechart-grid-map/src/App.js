import React, { Component } from 'react';
// Material-UI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PieChartIcon from '@material-ui/icons/PieChart';
import GridOnIcon from '@material-ui/icons/GridOn';
import MapIcon from '@material-ui/icons/Map';
import Box from '@material-ui/core/Box';

import Sunburst from './components/Sunburst';
import PieChart from './components/PieChart';
import Mapbox from './components/Mapbox';
import AgGrid from './components/AgGrid';
// Lattice
import { Widget } from '@latticejs/widgets';

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
    this.state = {
      selectedTab: 0
    };
  }

  handleNightModeChange = () => {
    const { updateTheme, nightMode } = this.props;
    updateTheme(!nightMode);
  };

  handleChange = (event, newTab) => {
    this.setState({
      selectedTab: newTab
    });
  };

  render() {
    const { classes, nightMode } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              USA Census
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
          <Grid container justify="flex-start" spacing={Number('4')}>
            <Grid item xs={6}>
              <Widget className={classes.widget} title="State & County Data" border="top">
                <Sunburst />
              </Widget>
            </Grid>
            <Grid item xs={6}>
              <Widget className={classes.widget} title="State Data" border="top">
                <PieChart />
              </Widget>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={this.state.selectedTab} index={1}>
          <Grid container justify="space-center" spacing={Number(0)}>
            <Grid item xs={12}>
              <Widget className={classes.widget} title="State & County Population" border="top">
                <AgGrid />
              </Widget>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={this.state.selectedTab} index={2}>
          <Grid container justify="space-center" spacing={Number(0)}>
            <Grid item xs={12}>
              <Mapbox />
            </Grid>
          </Grid>
        </TabPanel>
      </div>
    );
  }
}

export default withStyles(styles)(App);
