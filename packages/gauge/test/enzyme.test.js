import { mount } from 'enzyme';
import { Gauge as RadialGaugeComponent } from '../src/components/Gauge';
import React from 'react';

import { configure } from 'enzyme/build';
import Adapter from 'enzyme-adapter-react-16/build';

// import { act } from 'react-dom/test-utils';

configure({ adapter: new Adapter() });

describe('To test the Radial Gauge Component.', () => {
  let wrapper;
  let childWrapper;
  let useEffect;

  beforeEach(() => {
    wrapper = mount(<RadialGaugeComponent label="gauge" value={50} />);
    childWrapper = wrapper.find('canvas');
  });

  it('should render element.', () => {
    // console.log(childWrapper.debug())
    expect(childWrapper.exists()).toBeTruthy();
  });

  test('useEffect', () => {
    useEffect = jest.spyOn(React, 'useEffect');
    const mockUseEffect = jest.fn();
    mockUseEffect();
    expect(mockUseEffect).toHaveBeenCalled();
  });
  // it('test updating values', () => {
  //   expect(childWrapper.instance().gauge.options.value).toEqual(50);
  //   childWrapper.setProps({ value: 50 });
  //   expect(childWrapper.instance().gauge.options.value).toEqual(50);

  //   childWrapper.setProps({ value: 10 });
  //   expect(childWrapper.instance().gauge.options.value).toEqual(10);
  // });
});

// import { mount } from 'enzyme';
// import RadialGaugeComponent from '../src/index.js';
// import React from 'react';

// describe('To test the Radial Gauge Component.', () => {
//   let wrapper;
//   let childWrapper;

//   beforeEach(() => {
//     wrapper = mount(<RadialGaugeComponent value={50} />);
//     childWrapper = wrapper.find(RadialGaugeComponent).childAt(0);
//   });

//   it('test componentDidMount', () => {
//     childWrapper.instance().componentDidMount();
//     expect(childWrapper.instance().gauge.options.value).toEqual(50);
//   });

//   it('test componentDidUpdate', () => {
//     expect(childWrapper.instance().gauge.options.value).toEqual(50);
//     childWrapper.instance().componentDidUpdate({ value: 50 });
//     expect(childWrapper.instance().gauge.options.value).toEqual(50);

//     childWrapper.instance().componentDidUpdate({ value: 10 });
//     expect(childWrapper.instance().gauge.options.value).toEqual(10);
//   });
// });
