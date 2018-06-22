import React, { Component } from 'react';

// Material UI
import Grid from '@material-ui/core/Grid';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';

// Ours
import { List, ListItem, Table, TableBody, TableHead, TableRow, TableCell } from '../src';
import muiTheme from '../.storybook/decorator-material-ui';

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
  static defaultProps = {
    limit: 10,
    width: 200,
    height: 400
  };

  state = {
    items: Array.from(Array(10).keys()).map(v => ({ index: v, title: `title ${v}`, timestamp: Date.now() }))
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
}

class BasicList extends Basic {
  render() {
    const { height } = this.props;
    const { items } = this.state;

    return (
      <Paper>
        <List
          loadMore={this.loadMore}
          findItem={this.findItem}
          list={items}
          rowCount={1000}
          rowHeight={68}
          height={height}
        >
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
  }
}

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
            {({ item, isEmpty, key, style }) => {
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
            }}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

export default ({ storiesOf, action }) => {
  storiesOf('InfiniteLoader', module)
    .addDecorator(InGrid)
    .addDecorator(Flexed)
    .addDecorator(muiTheme())
    .addDecorator(FullViewport)
    .add('basic list', () => <BasicList />)
    .add('basic table', () => <BasicTable />);
};
