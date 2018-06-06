import React from 'react';
import { mount } from 'enzyme';

import Sunburst from '../';
import Tooltip from '@material-ui/core/Tooltip';

const data = [
  {
    children: [
      { name: 'Data', size: 20544 },
      { name: 'DataList', size: 19788 },
      { name: 'DataSprite', size: 10349 },
      { name: 'EdgeSprite', size: 3301 },
      { name: 'NodeSprite', size: 19382 },
      {
        name: 'render',
        children: [
          { name: 'ArrowType', size: 698 },
          { name: 'EdgeRenderer', size: 5569 },
          { name: 'IRenderer', size: 353 },
          { name: 'ShapeRenderer', size: 2247 },
        ],
      },
      { name: 'ScaleBinding', size: 11275 },
      { name: 'Tree', size: 7147 },
      { name: 'TreeBuilder', size: 9930 },
    ],
  },
];

class MyTooltip extends React.Component {
  static displayName='Tooltip'
  render () {
    return (
        <span id='dummy-tooltip'>tooltip</span>
    )
  }
}

describe('<Sunburst />', () => {
	it('renders one <Sunburst /> component', () => {
    const wrapper = mount(<Sunburst
      width={500}
      height={500}
      data={data}
      dataKey='size'
      ratio={4/3}
      isTooltipActive={true}
    />);

    expect(wrapper.find('Sunburst').length).toBe(1);
    // at least one svg g children
    expect(wrapper.find('.recharts-sunburst-depth-0')).toBeDefined();
	});

  it('renders one <Sunburst /> component with a tooltip', () => {
    const wrapper = mount(<Sunburst
      width={500}
      height={500}
      data={data}
      dataKey='size'
      ratio={4/3}
    >
      <MyTooltip />
    </Sunburst>
    );

    expect(wrapper.find('Sunburst').length).toBe(1);
    expect(wrapper.find('#dummy-tooltip').length).toBe(1);
	});

})
