import { mount } from 'enzyme';

import Map from '../src/index.js';
import React from 'react';
jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  Map: x => ({
    x: x,
    on: jest.fn()
  })
}));

describe('To test the Map Box Component.', () => {
  let wrapper;
  let childWrapper;

  beforeEach(() => {
    wrapper = mount(
      <Map
        longitude={5}
        latitude={34}
        zoom={1.5}
        accessToken="pk.eyJ1IjoiY2VsZXN0aWFsc3lzIiwiYSI6ImNrMzVoZTY2ZzA0ZmczY3J3cWlqbmptcXcifQ.0m0LKMmE9yGqFTXbZ-h4bQ"
        afterMapComplete={jest.fn()}
      />
    );
    childWrapper = wrapper.find(Map).childAt(0);
  });

  it('test <Map /> Component render', () => {
    expect(wrapper.find(Map).length).toBe(1);
  });

  it('test componentDidMount', () => {
    childWrapper.instance().componentDidMount();
    expect(childWrapper.instance().map.x.zoom).toEqual(1.5);
  });

  it('test componentDidUpdate', () => {
    childWrapper.instance().generateMap = jest.fn();
    expect(childWrapper.instance().state.mapStyle).toMatch('streets-v9');
    const newTheme = {
      theme: {
        palette: {
          type: 'light'
        }
      }
    };

    childWrapper.instance().componentDidUpdate(newTheme);
    expect(childWrapper.instance().generateMap.mock.calls.length).toBe(1);
    expect(childWrapper.instance().state.mapStyle).toMatch('streets-v9');
    const updatedTheme = {
      theme: {
        palette: {
          type: 'dark'
        }
      }
    };
    wrapper.setProps(updatedTheme);
    wrapper.update();
    expect(childWrapper.instance().state.mapStyle).toMatch('dark-v9');
  });

  it('test getMap', () => {
    childWrapper.instance().map = { test: '1234' };
    expect(childWrapper.instance().getMap()).toEqual({ test: '1234' });
  });
});
