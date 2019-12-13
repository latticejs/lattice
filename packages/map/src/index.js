import React, { Component } from 'react';
import Mapboxgl from 'mapbox-gl';
import { withTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

class Map extends Component {
  constructor(props) {
    super(props);
    Mapboxgl.accessToken = this.props.accessToken;
    this.generateMap = this.generateMap.bind(this);
    this.getInitialMapStyle = this.getInitialMapStyle.bind(this);

    this.state = {
      longitude: this.props.longitude,
      latitude: this.props.latitude,
      zoom: this.props.zoom,
      mapStyle: this.getInitialMapStyle(),
      theme: this.props.theme,
      height: this.props.height,
      width: this.props.width
    };
  }

  componentDidMount() {
    return this.generateMap();
  }

  /**
   * Return the initial mapStyle as per selected theme.
   */
  getInitialMapStyle() {
    if (this.props.mapStyle) {
      return this.props.mapStyle;
    } else {
      if (this.props.theme.palette.type === 'light') {
        return this.props.lightTheme;
      } else if (this.props.theme.palette.type === 'dark') {
        return this.props.darkTheme;
      }
    }
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
        this.setState({ mapStyle: this.props.lightTheme }, this.generateMap);
      } else if (this.props.theme.palette.type === 'dark') {
        this.setState({ mapStyle: this.props.darkTheme }, this.generateMap);
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

Map.propTypes = {
  darkTheme: PropTypes.string,
  lightTheme: PropTypes.string,
  theme: PropTypes.object,
  longitude: PropTypes.number,
  latitude: PropTypes.number,
  zoom: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.number
};

Map.defaultProps = {
  darkTheme: 'dark-v9',
  lightTheme: 'streets-v9',
  width: 200,
  height: 200
};

export default withTheme(Map);
