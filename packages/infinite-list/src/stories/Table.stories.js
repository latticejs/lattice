import React, { useState } from 'react';

import { Table, TableBody, TableHead, TableRow, TableCell, TableOrderCell, TableSearchCell } from '../components/';
import muiTheme from '../../.storybook/decorator-material-ui';

// Material UI
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';

export default {
  title: 'Example/Table',
  component: Table,
  addDecorators: muiTheme(),
};
const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));
const renderBody = ({ item, isEmpty, key, style }) => {
  if (isEmpty) {
    return <h4>Empty list</h4>;
  }

  if (!item) {
    return (
      <TableRow key={key} style={style}>
        <TableCell>loading...</TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow key={key} style={style}>
      <TableCell>{item.index}</TableCell>
      <TableCell>{item.title}</TableCell>
      <TableCell>{item.timestamp}</TableCell>
    </TableRow>
  );
};

const BasicTable = () => {
  const [state, setState] = useState({
    items: Array.from(Array(10).keys()).map((v) => ({ index: v, title: `title ${v}`, timestamp: Date.now() })),
    orderBy: [],
    filterBy: [],
  });

  const findItem = ({ index }) => {
    return state.items.find((i) => i.index === index);
  };

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

  // const { height } = props;
  const { items } = state;

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Index</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Timestamp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody loadMore={loadMore} findItem={findItem} list={items} rowCount={1000} rowHeight={48} height={400}>
          {renderBody}
        </TableBody>
      </Table>
    </Paper>
  );
};

BasicTable.defaultProps = {
  limit: 10,
  width: 200,
  height: 400,
};

const OrderTable = () => {
  const [state, setState] = useState({
    orderBy: [],
  });
  const handleOrder = (orderBy) => {
    setState({ orderBy });
  };

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Index</TableCell>
            <TableOrderCell field="title" title="Title" orderBy={state.orderBy} handleOrder={handleOrder} />
            <TableOrderCell field="timestamp" title="Timestamp" orderBy={state.orderBy} handleOrder={handleOrder} />
          </TableRow>
        </TableHead>
      </Table>
      <Typography variant="caption" style={{ margin: 10 }}>
        - tip: use [shift + click] to sort by multiple fields
      </Typography>
      <Typography variant="body2" gutterBottom style={{ margin: 10 }}>
        Result: {JSON.stringify(state.orderBy)}
      </Typography>
    </Paper>
  );
};

const SearchTable = () => {
  const [state, setState] = useState({
    filterBy: [],
  });

  const handleSearch = (filterBy) => {
    setState({ filterBy });
  };

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Index</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Timestamp</TableCell>
          </TableRow>
          <TableRow>
            <TableCell />
            <TableSearchCell field="name" debounce={200} filterBy={state.filterBy} handleSearch={handleSearch}>
              {({ inputProps }) => <Input fullWidth {...inputProps} />}
            </TableSearchCell>
            <TableSearchCell field="email" filterBy={state.filterBy} handleSearch={handleSearch}>
              {({ inputProps }) => <Input fullWidth {...inputProps} />}
            </TableSearchCell>
          </TableRow>
        </TableHead>
      </Table>
      <Typography variant="body2" gutterBottom style={{ margin: 10 }}>
        Result: {JSON.stringify(state.filterBy)}
      </Typography>
    </Paper>
  );
};

const Template = (args) => {
  if (args.type === 'Basic') {
    return <BasicTable {...args} />;
  }
  if (args.type === 'Order') {
    return <OrderTable {...args} />;
  }
  if (args.type === 'Search') {
    return <SearchTable {...args} />;
  }
};
export const Basic = Template.bind({});
Basic.args = {
  type: 'Basic',
};
export const Order = Template.bind({});
Order.args = {
  type: 'Order',
};
export const Search = Template.bind({});
Search.args = {
  type: 'Search',
};
