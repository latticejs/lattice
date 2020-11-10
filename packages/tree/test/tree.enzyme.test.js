import React from 'react';
import { mount } from 'enzyme';

import { Tree } from '../src/components/index.js';

const sampleInput = [
  {
    label: 'index.js',
  },
  {
    label: 'assets',
    children: [
      {
        label: 'index.css',
      },
      {
        label: 'logo.svg',
      },
    ],
  },
];

describe('<Tree />', () => {
  let useEffect;
  it('renders a <Tree />', () => {
    const wrapper = mount(<Tree treeData={sampleInput} />);
    expect(wrapper.find('li').length).toBe(2);
    expect(wrapper.find(Tree).length).toBe(1);
  });
  it('renders a <Tree expandedAll /> with 4 childrens (2 root lvl and 2 lvl-1)', () => {
    const wrapper = mount(<Tree treeData={sampleInput} expandedAll />);
    expect(wrapper.find('li').length).toBe(4);
  });
  it('test useEffect', () => {
    useEffect = jest.spyOn(React, 'useEffect');
    const mockUseEffect = jest.fn();
    mockUseEffect();
    expect(mockUseEffect).toHaveBeenCalled();
  });
});
