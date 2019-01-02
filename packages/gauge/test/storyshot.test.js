import { mount } from 'enzyme';
import RadialGaugeComponent from '../src/index.js';
import React from 'react';

describe('To test the Radial Gauge Component.', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<RadialGaugeComponent value={50} />);
  });

  it('test componentDidMount', () => {
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().gauge.value).toEqual(50);
  });

  it('test componentWillReceiveProps', () => {
    expect(wrapper.instance().gauge.value).toEqual(50);
    wrapper.instance().componentWillReceiveProps({ value: 50 });
    expect(wrapper.instance().gauge.value).toEqual(50);

    wrapper.instance().componentWillReceiveProps({ value: 10 });
    expect(wrapper.instance().gauge.value).toEqual(10);
  });
});
