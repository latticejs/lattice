import React from 'react';
import { mount } from 'enzyme';

import Dag from '../src';

describe('<Dag />', () => {
  it('renders one <Dag /> component', () => {
    const wrapper = mount(<Dag width={500} height={500} nodes={[]} edges={[]} />);
    expect(wrapper.find('.dag-wrapper').length).toBe(1);
  });

  it('renders a <Dag editable={true}/> component', () => {
    const nodes = [{ title: 'app' }, { title: 'lodash' }];
    const edges = [{ source: 'app', target: 'lodash' }];
    const onEdgeAdded = jest.fn();
    const wrapper = mount(
      <Dag width={500} height={500} nodes={nodes} editable={true} edges={edges} onEdgeAdded={onEdgeAdded} />
    );

    expect(wrapper.find('.dag-wrapper').length).toBe(1);
    expect(onEdgeAdded).not.toHaveBeenCalled();
    wrapper
      .find('.node')
      .at(0)
      .simulate('click');
    wrapper
      .find('.node')
      .at(1)
      .simulate('click');
    expect(onEdgeAdded).toHaveBeenCalled();
  });
});
