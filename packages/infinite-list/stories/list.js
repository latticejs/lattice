import React, { Component } from 'react';

// Material UI
import Grid from '@material-ui/core/Grid';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';

// Ours
import { List, ListItem } from '../src';
import muiTheme from '../.storybook/decorator-material-ui';
import Readme from '../README.md';
import { JssDecorator } from './utils';
import { withReadme } from '@latticejs/storybook-readme';

// Decorators

const InGrid = (story) => (
  <Grid container spacing={3}>
    <Grid item xs={12}>
      {story()}
    </Grid>
  </Grid>
);

const Flexed = (story) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>{story()}</div>
);

const FullViewport = (story) => <div style={{ height: '100vh', width: '100vw', padding: 12 }}>{story()}</div>;

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

class Basic extends Component {
  state = {
    items: Array.from(Array(10).keys()).map((v) => ({ index: v, title: `title ${v}`, timestamp: Date.now() })),
  };

  findItem = ({ index }) => {
    return this.state.items.find((i) => i.index === index);
  };

  loadMore = async ({ startIndex, stopIndex }) => {
    await delay(500);

    this.setState((state) => {
      const newItems = Array.from(Array(stopIndex - startIndex + 1).keys()).map((v) => ({
        index: startIndex + v,
        title: `title ${startIndex + v}`,
        timestamp: Date.now(),
      }));

      return { items: [...state.items, ...newItems] };
    });
  };
}

Basic.defaultProps = {
  limit: 10,
  width: 200,
  height: 400,
};

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

const loadReadmeSections = withReadme(Readme);
const withReadmeSections = loadReadmeSections(['list', 'scroll-loader']);

export default ({ storiesOf }) => {
  storiesOf('infinite-list/List', module)
    .addDecorator(JssDecorator)
    .addDecorator(InGrid)
    .addDecorator(Flexed)
    .addDecorator(muiTheme())
    .addDecorator(FullViewport)
    .add(
      'basic',
      withReadmeSections(() => <BasicList />)
    );
};
