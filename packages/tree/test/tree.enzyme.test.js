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
  it('renders <Tree />', () => {
    const wrapper = mount(<Tree treeData={sampleInput} />);
    const targetTree = '.tree-wrapper';
    expect(wrapper.find(targetTree).length).toBe(3);
  });
  it('renders <Tree /> with 4 childrens (2 root lvl and 2 lvl-1)', () => {});
});
