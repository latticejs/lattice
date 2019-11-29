import React, { Component } from 'react';
import Mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { withTheme } from '@material-ui/core/styles';

class Map extends Component {
  constructor(props) {
    super(props);
    Mapboxgl.accessToken = this.props.accessToken;
    this.generateMap = this.generateMap.bind(this);
    this.state = {
      longitude: this.props.longitude,
      latitude: this.props.latitude,
      zoom: this.props.zoom,
      mapStyle: this.props.mapStyle ? this.props.mapStyle : 'streets-v9',
      theme: this.props.theme
    };
  }

  componentDidMount() {
    this.generateMap();
  }

  generateMap() {
    this.mapContainer.innerHTML = '';
    const { longitude, latitude, zoom, mapStyle } = this.state;
    const map = new Mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/' + mapStyle,
      center: [longitude, latitude],
      zoom
    });

    let navigation = new Mapboxgl.NavigationControl();
    map.addControl(navigation, 'top-left');

    map.addControl(
      new MapboxGeocoder({
        accessToken: Mapboxgl.accessToken,
        mapboxgl: Mapboxgl
      })
    );

    map.on('render', function(evt) {
      //console.log(evt.target.getStyle().layers);
      let layers = ['country-label-lg', 'place-city-sm'];
      layers.map(layer => {
        map.setLayoutProperty(layer, 'text-field', [
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
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps.theme) !== JSON.stringify(prevState.theme)) {
      return nextProps.theme;
    }
    return null;
  }
  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevProps.theme) !== JSON.stringify(this.props.theme)) {
      if (this.props.theme.palette.type === 'light') {
        this.setState({ mapStyle: 'streets-v9' }, this.generateMap);
      } else if (this.props.theme.palette.type === 'dark') {
        this.setState({ mapStyle: 'dark-v9' }, this.generateMap);
      }
    }
  }

  render() {
    return <div ref={el => (this.mapContainer = el)} className="mapContainer" />;
  }
}

export default withTheme(Map);
