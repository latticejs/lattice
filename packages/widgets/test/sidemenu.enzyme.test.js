import React from 'react';
import { mount } from 'enzyme';

import { SideMenu } from '../src';

const sideMenuMockClick = jest.fn();
const navigation = [
  {
    path: '/employees',
    title: 'Employees',
    component: () => <div>dummy</div>
  }
];

describe('<SideMenu />', () => {
  it('has a functioning click handler', () => {
    const wrapper = mount(<SideMenu width={200} navigation={navigation} onItemClick={sideMenuMockClick} />);
    expect(wrapper.find(SideMenu).length).toBe(1);
    // simulate click on item, finding children using displayname
    wrapper.find('ButtonBase').simulate('click');
    expect(sideMenuMockClick.mock.calls.length).toEqual(1);
  });
});
