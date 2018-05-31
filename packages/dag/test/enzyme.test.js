import React from 'react';
import { shallow } from 'enzyme';

import Dag from '../';

describe('<MyComponent />', () => {
	it('renders three <Foo /> components', () => {
		const wrapper = shallow(<Dag />);
		expect(wrapper.find('.dag-wrapper')).to.have.length(1);
	});
})
