import { mount } from 'enzyme';
import MapComponent from '../src/index.js';
import React from 'react';

describe('To test the Map Component.', () => {
  let wrapper;
  let childWrapper;

  beforeEach(() => {
    wrapper = mount(<MapComponent longitude={5} latitude={34} zoom={1} />);
    childWrapper = wrapper.find(MapComponent).childAt(0);
  });

  it('test componentDidMount', () => {
    childWrapper.instance().componentDidMount();
    expect(childWrapper.instance().map.longitude.value).toEqual(5);
  });

  // it('test componentWillReceiveProps', () => {
  //   expect(childWrapper.instance().gauge.options.value).toEqual(50);
  //   childWrapper.instance().componentDidUpdate({ value: 50 });
  //   expect(childWrapper.instance().gauge.options.value).toEqual(50);

  //   childWrapper.instance().componentDidUpdate({ value: 10 });
  //   expect(childWrapper.instance().gauge.options.value).toEqual(10);
  // });
});
