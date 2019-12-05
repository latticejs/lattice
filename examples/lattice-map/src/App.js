import React, { Component } from 'react';
// Material-UI
import { AppBar, Toolbar, Tooltip, IconButton, Grid, Typography, withStyles } from '@material-ui/core';
import LatticeMap from '@latticejs/map';
import Mapboxgl from 'mapbox-gl';
import '@latticejs/map/css/style.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { token } from '../config';

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
  content: {
    fontFamily: theme.typography.fontFamily,
    flex: 1
  },
  link: {
    color: theme.palette.text.secondary
  }
});

class App extends Component {
  handleNightModeChange = () => {
    const { updateTheme, nightMode } = this.props;
    updateTheme(!nightMode);
  };

  afterMapLoad = mapObj => {
    let navigation = new Mapboxgl.NavigationControl();
    mapObj.addControl(navigation, 'top-left');
    mapObj.addControl(
      new MapboxGeocoder({
        accessToken: Mapboxgl.accessToken,
        mapboxgl: Mapboxgl
      })
    );

    mapObj.on('render', function(evt) {
      let layers = ['country-label-lg', 'place-city-sm'];
      layers.map(layer => {
        mapObj.setLayoutProperty(layer, 'text-field', [
          'format',
          ['get', 'name_en'],
          {
            'font-scale': 1.2,
            'text-font': ['literal', ['Roboto Bold']]
          }
        ]);
        return null;
      });
    });
  };

  render() {
    const { classes, nightMode } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              Lattice Map Example
            </Typography>
            <Tooltip title="Toggle Night Mode" enterDelay={300}>
              <IconButton onClick={this.handleNightModeChange} color="inherit">
                {nightMode ? <DayIcon /> : <NightIcon />}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Grid>
          <LatticeMap
            longitude={5}
            latitude={34}
            zoom={1.5}
            accessToken={token}
            afterMapComplete={this.afterMapLoad}
            height={91}
            width={100}
          />
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(App);
