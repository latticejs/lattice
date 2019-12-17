import { mount } from 'enzyme';
import Editor from '../src/index.js';
import React from 'react';

describe('To test the Froala Editor Component.', () => {
  let wrapper;
  let childWrapper;

  beforeEach(() => {
    wrapper = mount(<Editor />);
    childWrapper = wrapper.find(Editor).childAt(0);
  });

  it('test componentDidUpdate', () => {
    const newTheme = {
      theme: {
        palette: {
          type: 'dark'
        }
      }
    };

    expect(childWrapper.instance().state.theme).toBe('royal');

    wrapper.setProps(newTheme);
    wrapper.update();
    expect(
      wrapper
        .find(Editor)
        .childAt(0)
        .instance().state.theme
    ).toBe('dark');
  });

  it('test getConfig', () => {
    const defaultConfig = childWrapper.instance().getConfig();
    const expectedConfig = {
      theme: 'royal',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
    };
    expect(defaultConfig.fontFamily).toMatch(expectedConfig.fontFamily);
  });

  it('test handleModelChange', () => {
    expect(childWrapper.instance().state.model).toBe('');

    childWrapper.instance().handleModelChange('<p>Test model content</p>');
    expect(childWrapper.instance().state.model).toBe('<p>Test model content</p>');
  });

  it('test handleManualController', () => {
    expect(childWrapper.instance().state.initControls).toHaveProperty('destroy');
    expect(childWrapper.instance().state.initControls).toHaveProperty('initialize');
    expect(childWrapper.instance().state.initControls).toHaveProperty('getEditor');

    const initControls = {
      testProp: '',
      initialize: jest.fn()
    };

    childWrapper.instance().handleManualController(initControls);
    expect(childWrapper.instance().state.initControls).toHaveProperty('testProp');
  });
});
