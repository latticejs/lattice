import React from 'react';
import { mount } from 'enzyme';

import { List, ListItem } from '../src';
import ListItemText from '@material-ui/core/ListItemText';

const list = Array.from(Array(10).keys()).map(v => ({ index: v, title: `title ${v}` }));

const renderRow = ({ item, isEmpty, key, style }) => {
  if (isEmpty) {
    return <h4>Empty list</h4>;
  }

  if (!item) {
    return (
      <ListItem key={key} style={style}>
        <ListItemText primary="loading..." />
      </ListItem>
    );
  }

  return (
    <ListItem key={key} style={style}>
      <ListItemText primary={item.title} />
    </ListItem>
  );
};

describe('<List />', () => {
  it('renders <List /> with 10 <ListItem /> as divs', () => {
    const wrapper = mount(
      <List loadMore={() => {}} list={list} rowCount={list.length} rowHeight={68} height={150} width={150}>
        {renderRow}
      </List>
    );
    expect(wrapper.find('ul').length).toBe(0);
    expect(wrapper.find('li').length).toBe(0);

    const virtualizedTree = '.ReactVirtualized__Grid__innerScrollContainer';
    expect(wrapper.find(virtualizedTree).length).toBe(1);
    expect(wrapper.find(virtualizedTree).children().length).toBe(list.length); // 10
  });
});
