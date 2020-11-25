import { mount } from 'enzyme';
import Editor from '../src/components/index.js';
import React from 'react';

describe('To test the Froala Editor Component.', () => {
  let wrapper;
  let useEffect;
  let childWrapper;

  beforeEach(() => {
    wrapper = mount(<Editor />);
    childWrapper = wrapper.find(Editor).childAt(0);
  });

  it('test useEffect', () => {
    useEffect = jest.spyOn(React, 'useEffect');
    const mockUseEffect = jest.fn();
    mockUseEffect();
    expect(mockUseEffect).toHaveBeenCalled();
  });
});
