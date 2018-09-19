import React, { Component } from 'react';

// Material UI
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';

// Ours
import { Table, TableBody, TableHead, TableRow, TableCell, TableOrderCell, TableSearchCell } from '../src';
import muiTheme from '../.storybook/decorator-material-ui';
import Readme from '../README.md';
import { JssDecorator } from './utils';
import { withReadme } from '@latticejs/storybook-readme';

// Decorators

const InGrid = story => (
  <Grid container spacing={24}>
    <Grid item xs={12}>
      {story()}
    </Grid>
  </Grid>
);

const Flexed = story => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>{story()}</div>
);

const FullViewport = story => <div style={{ height: '100vh', width: '100vw', padding: 12 }}>{story()}</div>;

const delay = time => new Promise(resolve => setTimeout(resolve, time));

class Basic extends Component {
  state = {
    items: Array.from(Array(10).keys()).map(v => ({ index: v, title: `title ${v}`, timestamp: Date.now() })),
    orderBy: [],
    filterBy: []
  };

  findItem = ({ index }) => {
    return this.state.items.find(i => i.index === index);
  };

  loadMore = async ({ startIndex, stopIndex }) => {
    await delay(500);

    this.setState(state => {
      const newItems = Array.from(Array(stopIndex - startIndex + 1).keys()).map(v => ({
        index: startIndex + v,
        title: `title ${startIndex + v}`,
        timestamp: Date.now()
      }));

      return { items: [...state.items, ...newItems] };
    });
  };

  handleOrder = orderBy => {
    this.setState({ orderBy });
  };

  handleSearch = filterBy => {
    this.setState({ filterBy });
  };
}

Basic.defaultProps = {
  limit: 10,
  width: 200,
  height: 400
};

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

class BasicTable extends Basic {
  render() {
    const { height } = this.props;
    const { items } = this.state;

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
          <TableBody
            loadMore={this.loadMore}
            findItem={this.findItem}
            list={items}
            rowCount={1000}
            rowHeight={48}
            height={height}
          >
            {renderBody}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}
class OrderTable extends Basic {
  render() {
    const { orderBy = [] } = this.state;

    return (
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Index</TableCell>
              <TableOrderCell field="title" title="Title" orderBy={orderBy} handleOrder={this.handleOrder} />
              <TableOrderCell field="timestamp" title="Timestamp" orderBy={orderBy} handleOrder={this.handleOrder} />
            </TableRow>
          </TableHead>
        </Table>
        <Typography variant="caption" style={{ margin: 10 }}>
          - tip: use [shift + click] to sort by multiple fields
        </Typography>
        <Typography variant="body2" gutterBottom style={{ margin: 10 }}>
          Result: {JSON.stringify(orderBy)}
        </Typography>
      </Paper>
    );
  }
}

class SearchTable extends Basic {
  render() {
    const { filterBy = [] } = this.state;

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
              <TableSearchCell field="name" debounce={200} filterBy={filterBy} handleSearch={this.handleSearch}>
                {({ inputProps }) => <Input fullWidth {...inputProps} />}
              </TableSearchCell>
              <TableSearchCell field="email" filterBy={filterBy} handleSearch={this.handleSearch}>
                {({ inputProps }) => <Input fullWidth {...inputProps} />}
              </TableSearchCell>
            </TableRow>
          </TableHead>
        </Table>
        <Typography variant="body2" gutterBottom style={{ margin: 10 }}>
          Result: {JSON.stringify(filterBy)}
        </Typography>
      </Paper>
    );
  }
}

const loadReadmeSections = withReadme(Readme);
const withReadmeForBasic = loadReadmeSections(['table', 'table-body', 'scroll-loader']);
const withReadmeForOrder = loadReadmeSections(['table-order-cell']);
const withReadmeForSearch = loadReadmeSections(['table-search-cell']);

export default ({ storiesOf }) => {
  storiesOf('infinite-list/Table', module)
    .addDecorator(JssDecorator)
    .addDecorator(InGrid)
    .addDecorator(Flexed)
    .addDecorator(muiTheme())
    .addDecorator(FullViewport)
    .add('basic', withReadmeForBasic(() => <BasicTable />))
    .add('order', withReadmeForOrder(() => <OrderTable />))
    .add('search', withReadmeForSearch(() => <SearchTable />));
};
