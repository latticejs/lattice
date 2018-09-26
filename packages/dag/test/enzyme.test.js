import React from 'react';
import { mount } from 'enzyme';

import Dag, { DAG_DEFAULTS } from '../src';

describe('<Dag />', () => {
  it('renders one <Dag /> component', () => {
    const wrapper = mount(<Dag width={500} height={500} nodes={[]} edges={[]} />);
    expect(wrapper.find('.dag-wrapper').length).toBe(1);
  });
  /*
  it('renders a <Dag editable={true}/> and creates a new edge', () => {
    const nodes = [{ title: 'app' }, { title: 'lodash' }];
    const edges = [{ source: 'app', target: 'lodash' }];
    const onEdgeAdded = jest.fn();
    const wrapper = mount(
      <Dag width={500} height={500} nodes={nodes} editable={true} edges={edges} onEdgeAdded={onEdgeAdded} />
    );

    expect(wrapper.find('.dag-wrapper').length).toBe(1);
    expect(onEdgeAdded).not.toHaveBeenCalled();
    wrapper
      .find(`.${DAG_DEFAULTS.nodeClass}`) // click on a node, open panel
      .at(0)
      .simulate('click');
    wrapper
      .find(`.${DAG_DEFAULTS.nodeClass}`) // click on a node, open panel
      .at(0)
      .find('button')
      .at(1)
      .find('SvgIcon')
      .simulate('click');
    wrapper
      .find(`.${DAG_DEFAULTS.nodeClass}`) // click on another node
      .at(1)
      .simulate('click');
    expect(onEdgeAdded).toHaveBeenCalled();
  });
  */
  /*** NOTE(dk): commented out due to https://github.com/jsdom/jsdom/issues/300
  /*** Look for a workaround ***
  it('renders a <Dag editable={true}/> and creates a new node', () => {
    const nodes = [{ title: 'app' }, { title: 'lodash' }];
    const edges = [{ source: 'app', target: 'lodash' }];
    const CLIENTX = 200;
    const CLIENTY = 200;
    const NODENAME = 'test';
    const onNodeAdded = jest.fn();
    const wrapper = mount(
      <Dag width={500} height={500} nodes={nodes} editable={true} edges={edges} onNodeAdded={onNodeAdded} />
    );

    expect(onNodeAdded).not.toHaveBeenCalled();

    // find svg graph and double click it
    wrapper.find(`.${DAG_DEFAULTS.graphClass}`).simulate('dblclick', { clientX: CLIENTX, clientY: CLIENTY });

    // a new node should appear with a propr `data` with coords x and y equal to CLIENTY and CLIENTY.
    expect(
      wrapper
        .update()
        .find(`.${DAG_DEFAULTS.nodeClass}`)
        .last()
        .parent()
        .prop('data')
    ).toMatchObject({
      x: CLIENTX,
      y: CLIENTY
    });

    // set an input value for the new node and trigger ENTER
    wrapper
      .find(`.${DAG_DEFAULTS.nodeClass}`)
      .last()
      .find('input')
      .simulate('change', { target: { value: NODENAME } })
      .simulate('keydown', { keyCode: 13 });

    // finally, onNodeAdded should be called :)
    expect(onNodeAdded).toHaveBeenCalled();
  });
  */
});
