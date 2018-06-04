import React from 'react';
import { mount } from 'enzyme';

import { Widget, Sidement } from '../';

describe('<Widget />', () => {
	it('renders one empty <Widget /> component', () => {
    const wrapper = mount(
      <Widget 
        title={'test widget'}
      >
      </Widget>
    );
		expect(wrapper.find('h2').length).toBe(1);
	});
})
