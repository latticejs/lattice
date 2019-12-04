import React, { Component } from 'react';
import Mapboxgl from 'mapbox-gl';
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
    return this.generateMap();
  }

  generateMap() {
    this.mapContainer.innerHTML = '';
    const { longitude, latitude, zoom, mapStyle } = this.state;
    this.map = new Mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/' + mapStyle,
      center: [longitude, latitude],
      zoom,
      ...this.props
    });

    this.props.afterMapComplete(this.map);
  }

  getMap = () => {
    return this.map;
  };

  componentDidUpdate(prevProps) {
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
