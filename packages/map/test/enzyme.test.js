import { mount } from 'enzyme';

import Map from '../src/components/index.js';
import React from 'react';
jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  Map: (x) => ({
    x: x,
    on: jest.fn(),
  }),
}));

describe('To test the Map Box Component.', () => {
  let wrapper;
  let childWrapper;
  let useEffect;

  beforeEach(() => {
    wrapper = mount(
      <Map
        longitude={5}
        latitude={34}
        zoom={1.5}
        accessToken="token1234"
        afterMapComplete={jest.fn()}
        label="Shivani"
      />
    );
    childWrapper = wrapper.find(Map).childAt(0);
  });

  it('test <Map /> Component render', () => {
    expect(wrapper.find(Map).length).toBe(1);
  });

  test('useEffect', () => {
    useEffect = jest.spyOn(React, 'useEffect');
    const mockUseEffect = jest.fn();
    mockUseEffect();
    expect(mockUseEffect).toHaveBeenCalled();
  });
});
