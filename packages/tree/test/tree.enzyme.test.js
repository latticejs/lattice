import React from 'react';
import { mount } from 'enzyme';

import { Tree } from '../src';

const sampleInput = [
  {
    label: 'index.js'
  },
  {
    label: 'assets',
    children: [
      {
        label: 'index.css'
      },
      {
        label: 'logo.svg'
      }
    ]
  }
];

describe('<Tree />', () => {
  it('renders a <Tree />', () => {
    const wrapper = mount(<Tree treeData={sampleInput} />);
    expect(wrapper.find('li').length).toBe(2);
    expect(wrapper.find(Tree).length).toBe(1);
  });
  it('renders a <Tree expandedAll /> with 4 childrens (2 root lvl and 2 lvl-1)', () => {
    const wrapper = mount(<Tree treeData={sampleInput} expandedAll />);
    expect(wrapper.find('li').length).toBe(4);
  });
  it('renders a <Tree onCheckItem={cb}/> with onCheckItem cb defined and triggered', () => {
    const onCheckItemCb = jest.fn();
    const item = { items: [sampleInput[0]], check: true };
    const wrapper = mount(<Tree treeData={sampleInput} onCheckItem={onCheckItemCb} />);
    wrapper
      .find('li')
      .at(0)
      .find('input[type="checkbox"]')
      .simulate('change', { target: { checked: true } });
    expect(onCheckItemCb).toBeCalledWith(item);
  });
  it('renders a <Tree onUnfoldItem={cb}/> with onUnfoldItem cb defined and triggered', () => {
    const onUnfoldItemCb = jest.fn();
    const item = sampleInput[1];
    const wrapper = mount(<Tree treeData={sampleInput} onUnfoldItem={onUnfoldItemCb} />);
    wrapper
      .find('li')
      .at(1)
      .find('div')
      .first()
      .simulate('click');
    expect(onUnfoldItemCb).toBeCalledWith(item);
  });
  it('renders a <Tree onFoldItem={cb}/> with onFoldItem cb defined and triggered', () => {
    const onFoldItemCb = jest.fn();
    const item = sampleInput[1];
    const wrapper = mount(<Tree treeData={sampleInput} expandedAll onFoldItem={onFoldItemCb} />);
    wrapper
      .find('li')
      .at(1)
      .find('div')
      .first()
      .simulate('click');
    expect(onFoldItemCb).toBeCalledWith(item);
  });
});
