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
      theme: this.props.theme,
      height: this.props.height,
      width: this.props.width
    };
  }

  componentDidMount() {
    return this.generateMap();
  }

  /**
   * This function generate initial map and send mapObject to afterMapComplete()
   * @params void
   */
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

  /**
   * This function return current mapObject. When ever we need to customize map
   *  we can get the mapObject using getMap() and work on that object.
   * @params void
   * @returns Object
   */
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
    const style = {
      position: 'static',
      height: this.state.height + 'vh',
      width: this.state.width + '%'
    };

    return <div ref={el => (this.mapContainer = el)} style={style} />;
  }
}

export default withTheme(Map);
