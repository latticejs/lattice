import React, { Component } from 'react';
import LatticeMap from '@latticejs/map';
import Mapboxgl from 'mapbox-gl';
import '@latticejs/map/styles/style.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { token } from '../config';
import '../css/style.css';

class Mapbox extends Component {
  constructor(props) {
    super(props);

    this.mapObj = null;
    this.zoomThreshold = 4;

    this.afterMapLoad = this.afterMapLoad.bind(this);
    this.stateCountyLayerSetter = this.stateCountyLayerSetter.bind(this);
    this.manageZoom = this.manageZoom.bind(this);
    this.getStateLegendView = this.getStateLegendView.bind(this);
    this.getCountyLegendView = this.getCountyLegendView.bind(this);

    this.stateLegendView = this.getStateLegendView();
    this.countyLegendView = this.getCountyLegendView();
  }

  /**
   * Callback function after the Map is loaded.
   */
  afterMapLoad(mapObj) {
    this.mapObj = mapObj;
    let navigation = new Mapboxgl.NavigationControl();
    this.mapObj.addControl(navigation, 'top-left');
    this.mapObj.addControl(
      new MapboxGeocoder({
        accessToken: Mapboxgl.accessToken,
        mapboxgl: Mapboxgl
      })
    );
    this.mapObj.on('load', this.stateCountyLayerSetter);
    this.manageZoom();
  }

  /**
   * Set the layer for county and state.
   */
  stateCountyLayerSetter() {
    this.mapObj.addLayer(
      {
        id: 'state-population',
        source: {
          type: 'vector',
          url: 'mapbox://mapbox.660ui7x6'
        },
        'source-layer': 'state_county_population_2014_cen',
        maxzoom: this.zoomThreshold,
        type: 'fill',
        filter: ['==', 'isState', true],
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'population'],
            0,
            '#F2F12D',
            500000,
            '#EED322',
            750000,
            '#E6B71E',
            1000000,
            '#DA9C20',
            2500000,
            '#CA8323',
            5000000,
            '#B86B25',
            7500000,
            '#A25626',
            10000000,
            '#8B4225',
            25000000,
            '#723122'
          ],
          'fill-opacity': 0.75
        }
      },
      'waterway-label'
    );

    this.mapObj.addLayer(
      {
        id: 'county-population',
        source: {
          type: 'vector',
          url: 'mapbox://mapbox.660ui7x6'
        },
        'source-layer': 'state_county_population_2014_cen',
        minzoom: this.zoomThreshold,
        type: 'fill',
        filter: ['==', 'isCounty', true],
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'population'],
            0,
            '#F2F12D',
            100,
            '#EED322',
            1000,
            '#E6B71E',
            5000,
            '#DA9C20',
            10000,
            '#CA8323',
            50000,
            '#B86B25',
            100000,
            '#A25626',
            500000,
            '#8B4225',
            1000000,
            '#723122'
          ],
          'fill-opacity': 0.75
        }
      },
      'waterway-label'
    );
  }

  /**
   * Manages the zoom functionality.
   */
  manageZoom() {
    let stateLegendEl = document.getElementById('state-legend');
    let countyLegendEl = document.getElementById('county-legend');

    this.mapObj.on('zoom', () => {
      if (this.mapObj.getZoom() > this.zoomThreshold) {
        stateLegendEl.style.display = 'none';
        countyLegendEl.style.display = 'block';
      } else {
        stateLegendEl.style.display = 'block';
        countyLegendEl.style.display = 'none';
      }
    });
  }

  /**
   * Returns the State Layer legend.
   */
  getStateLegendView() {
    return (
      <div id="state-legend" className="legend">
        <h4>Population</h4>
        <div>
          <span style={{ backgroundColor: '#723122' }}></span>25,000,000
        </div>
        <div>
          <span style={{ backgroundColor: '#8B4225' }}></span>10,000,000
        </div>
        <div>
          <span style={{ backgroundColor: '#A25626' }}></span>7,500,000
        </div>
        <div>
          <span style={{ backgroundColor: '#B86B25' }}></span>5,000,000
        </div>
        <div>
          <span style={{ backgroundColor: '#CA8323' }}></span>2,500,000
        </div>
        <div>
          <span style={{ backgroundColor: '#DA9C20' }}></span>1,000,000
        </div>
        <div>
          <span style={{ backgroundColor: '#E6B71E' }}></span>750,000
        </div>
        <div>
          <span style={{ backgroundColor: '#EED322' }}></span>500,000
        </div>
        <div>
          <span style={{ backgroundColor: '#F2F12D' }}></span>0
        </div>
      </div>
    );
  }

  /**
   * Returns the County Layer legend.
   */
  getCountyLegendView() {
    return (
      <div id="county-legend" className="legend" style={{ display: 'none' }}>
        <h4>Population</h4>
        <div>
          <span style={{ backgroundColor: '#723122' }}></span>1,000,000
        </div>
        <div>
          <span style={{ backgroundColor: '#8B4225' }}></span>500,000
        </div>
        <div>
          <span style={{ backgroundColor: '#A25626' }}></span>100,000
        </div>
        <div>
          <span style={{ backgroundColor: '#B86B25' }}></span>50,000
        </div>
        <div>
          <span style={{ backgroundColor: '#CA8323' }}></span>10,000
        </div>
        <div>
          <span style={{ backgroundColor: '#DA9C20' }}></span>5,000
        </div>
        <div>
          <span style={{ backgroundColor: '#E6B71E' }}></span>1,000
        </div>
        <div>
          <span style={{ backgroundColor: '#EED322' }}></span>100
        </div>
        <div>
          <span style={{ backgroundColor: '#F2F12D' }}></span>0
        </div>
      </div>
    );
  }

  render() {
    return (
      <React.Fragment>
        <LatticeMap
          longitude={-102}
          latitude={40.08}
          minZoom={1}
          zoom={2}
          accessToken={token}
          afterMapComplete={this.afterMapLoad}
          height={75}
          width={100}
        />
        {this.stateLegendView}
        {this.countyLegendView}
      </React.Fragment>
    );
  }
}

export default Mapbox;
