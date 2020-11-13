import React, { useState } from 'react';
import { List, ListItem } from '../components/';

// Material UI
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';

export default {
  title: 'Example/List',
  component: List,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const BasicList = (props) => {
  const { height } = props;
  const [state, setState] = useState({
    items: Array.from(Array(10).keys()).map((v) => ({ index: v, title: `title ${v}`, timestamp: Date.now() })),
  });
  const findItem = ({ index }) => {
    return state.items.find((i) => i.index === index);
  };
  const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

  const loadMore = async ({ startIndex, stopIndex }) => {
    await delay(500);

    setState((state) => {
      const newItems = Array.from(Array(stopIndex - startIndex + 1).keys()).map((v) => ({
        index: startIndex + v,
        title: `title ${startIndex + v}`,
        timestamp: Date.now(),
      }));

      return { items: [...state.items, ...newItems] };
    });
  };
  const { items } = state;

  return (
    <Paper>
      <List loadMore={loadMore} findItem={findItem} list={items} rowCount={1000} rowHeight={68} height={height}>
        {({ item, isEmpty, key, style }) => {
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
        }}
      </List>
    </Paper>
  );
};

BasicList.defaultProps = {
  limit: 10,
  width: 200,
  height: 400,
};

const Template = (args) => <BasicList />;

export const BasicListOne = Template.bind({});
