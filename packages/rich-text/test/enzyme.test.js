import React from 'react';
import { mount } from 'enzyme';

import { RichText } from '../src';

describe('<RichText />', () => {
  it('renders one <RichText /> component', () => {
    const wrapper = mount(<RichText />);
    expect(wrapper.find(RichText).length).toBe(1);
  });
});
