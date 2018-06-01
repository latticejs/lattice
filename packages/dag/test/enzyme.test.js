import React from 'react';
import { mount } from 'enzyme';

import Dag from '../';

describe('<MyComponent />', () => {
	it('renders one <Dag /> component', () => {
    const wrapper = mount(<Dag 
      width={500}
      height={500}
      nodes={[]} 
      edges={[]}/>);
    console.log(wrapper.find('.dag-wrapper'))
		expect(wrapper.find('.dag-wrapper').length).toBe(1);
	});
})
