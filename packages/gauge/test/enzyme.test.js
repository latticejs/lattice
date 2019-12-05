import { mount } from 'enzyme';
import RadialGaugeComponent from '../src/index.js';
import React from 'react';

describe('To test the Radial Gauge Component.', () => {
  let wrapper;
  let childWrapper;

  beforeEach(() => {
    wrapper = mount(<RadialGaugeComponent value={50} />);
    childWrapper = wrapper.find(RadialGaugeComponent).childAt(0);
  });

  it('test componentDidMount', () => {
    childWrapper.instance().componentDidMount();
    expect(childWrapper.instance().gauge.options.value).toEqual(50);
  });

  it('test componentDidUpdate', () => {
    expect(childWrapper.instance().gauge.options.value).toEqual(50);
    childWrapper.instance().componentDidUpdate({ value: 50 });
    expect(childWrapper.instance().gauge.options.value).toEqual(50);

    childWrapper.instance().componentDidUpdate({ value: 10 });
    expect(childWrapper.instance().gauge.options.value).toEqual(10);
  });
});
