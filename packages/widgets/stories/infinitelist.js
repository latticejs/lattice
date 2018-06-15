import React, { Component } from 'react';

// Material UI
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

// Ours
import { InfiniteList } from '../src';
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
    items: Array.from(Array(10).keys()).map(v => ({ index: v, title: `title ${v}` }))
  };

  findItem = ({ index }) => {
    return this.state.items.find(i => i.index === index);
  };

  loadMore = async ({ startIndex, stopIndex }) => {
    await delay(500);

    this.setState(state => {
      const newItems = Array.from(Array(stopIndex - startIndex + 1).keys()).map(v => ({
        index: startIndex + v,
        title: `title ${startIndex + v}`
      }));

      return { items: [...state.items, ...newItems] };
    });
  };

  render() {
    const { height } = this.props;
    const { items } = this.state;

    return (
      <InfiniteList
        loadMore={this.loadMore}
        findItem={this.findItem}
        list={items}
        rowCount={1000}
        rowHeight={68}
        height={height}
      >
        {({ item, isEmpty, listItemProps }) => {
          if (isEmpty) {
            return <h4>Empty list</h4>;
          }

          if (!item) {
            return (
              <ListItem {...listItemProps}>
                <ListItemText primary="loading..." />
              </ListItem>
            );
          }

          return (
            <ListItem {...listItemProps}>
              <ListItemText primary={item.title} />
            </ListItem>
          );
        }}
      </InfiniteList>
    );
  }
}

export default ({ storiesOf, action }) => {
  storiesOf('InfiniteList', module)
    .addDecorator(InGrid)
    .addDecorator(Flexed)
    .addDecorator(muiTheme())
    .addDecorator(FullViewport)
    .add('basic', () => <Basic />);
};
