import React, { useEffect, useState } from 'react';
import Mapboxgl from 'mapbox-gl';
import { useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

export const Map = (props) => {
  const theme = useTheme();
  let mapContainer;
  let map;
  Mapboxgl.accessToken = props.accessToken;
  let fontFamily = theme.typography.fontFamily;

  /**
   * Return the initial mapStyle as per selected theme.
   */
  const getInitialMapStyle = () => {
    if (props.mapStyle) {
      return props.mapStyle;
    } else {
      if (theme.palette.type === 'light') {
        return props.lightTheme;
      } else if (theme.palette.type === 'dark') {
        return props.darkTheme;
      }
    }
  }

  const [state,setState] = useState({
    longitude: props.longitude,
    latitude: props.latitude,
    zoom: props.zoom,
    mapStyle: getInitialMapStyle(),
    height: props.height,
    width: props.width,
  });

  useEffect(()=>{
    if (theme.palette.type === 'light') {
      setState({ ...state, mapStyle: props.lightTheme });
    } else if (theme.palette.type === 'dark') {
      setState({ ...state, mapStyle: props.darkTheme });
    }
    return generateMap();
  },[]);

  /**
   * This function generate initial map and send mapObject to afterMapComplete()
   * @params void
   */
  const generateMap = () => {
    mapContainer.innerHTML = '';
    const { longitude, latitude, zoom, mapStyle } = state;
    map = new Mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/' + mapStyle,
      center: [longitude, latitude],
      zoom,
      ...props,
    });

    map.on('load', setLayerFont);
    props.afterMapComplete(map);
  }

  /**
   * Set the State and Country layer font.
   */
  const setLayerFont = () => {
    let fontArr = fontFamily.replace(/['"]+/g, '').split(',');
    let layers = ['country-label-lg', 'place-city-sm'];
    layers.map((layer) => {
      map.setLayoutProperty(layer, 'text-field', [
        'format',
        ['get', 'name_en'],
        {
          'font-scale': 1.2,
          'text-font': ['literal', [`${fontArr[0]} Bold`]],
        },
      ]);
      return null;
    });
  };

  /**
   * This function return current mapObject. When ever we need to customize map
   *  we can get the mapObject using getMap() and work on that object.
   * @params void
   * @returns Object
   */
  const getMap = () => {
    return map;
  };

  const style = {
    position: 'static',
    height: state.height + 'vh',
    width: state.width + '%',
  };

  return <div ref={(el) => (mapContainer = el)} style={style} />;
}

Map.propTypes = {
  darkTheme: PropTypes.string,
  lightTheme: PropTypes.string,
  longitude: PropTypes.number,
  latitude: PropTypes.number,
  zoom: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.number,
};

Map.defaultProps = {
  darkTheme: 'dark-v9',
  lightTheme: 'streets-v9',
  width: 200,
  height: 200,
};