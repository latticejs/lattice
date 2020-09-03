import React from 'react';
import { shallow } from 'enzyme';

import { withMuiStyle } from '../src';

class Dummy extends React.Component {
  static displayName = 'DummyComponent';
  render() {
    return <div className={this.props.classes.root} />;
  }
}

describe('mui-recharts', () => {
  it('renders one <Dummy /> component wrapped up with mui recharts', () => {
    const Wrapped = withMuiStyle(Dummy);
    const wrapper = shallow(<Wrapped />);

    expect(wrapper.find('MuiRechart(DummyComponent)').length).toBe(1);
    expect(wrapper.find('MuiRechart(DummyComponent)').dive().props().theme).toBeDefined();
  });
});
