import React from 'react';
import { mount } from 'enzyme';

import { Widget } from '../src/components/index';

describe('<Widget />', () => {
  it('renders one empty <Widget /> component with a title', () => {
    const wrapper = mount(<Widget title={'test widget'} />);
    expect(wrapper.find('h6').length).toBe(1);
    expect(wrapper.find('h6').text()).toBe('test widget');
  });
});
