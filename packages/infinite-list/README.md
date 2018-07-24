# @latticejs/infinite-list

A set of [material-ui](https://material-ui.com/) components adapted to support infinite list feature.

## Table of contents

Sections |
--- |
[Install](#install) |
[ScrollLoader](#scroll-loader) |
[List](#list) |

## <a name="install"></a> Install

```bash
npm install @latticejs/infinite-list
```

## <a name="scroll-loader"></a> ScrollLoader

The `ScrollLoader` is a react component based on set of components
from [react-virtualized](https://github.com/bvaughn/react-virtualized): InfiniteLoader, AutoSizer and List.

It's designed to keep simple the creation of a infinite loader list and at the same time you can access to each feature
of `react-virtualized` if you want.

`List` and `TableBody` works on top of this component.

ScrollLoader doesn't use the native scroll, it uses [react-custom-scrollbars](http://malte-wessel.github.io/react-custom-scrollbars/).

### Usage

```jsx
import React, { Component } from 'react';
import { ScrollLoader } from '@latticejs/infinite-list';

class App extends Component {
  state = {
    // loaded items
    list: [{ text: 'item 1' }, { text: 'item 2' }],
    // total items (loaded & missing items)
    rowCount: 100
  };

  loadMore = async ({ startIndex, stopIndex }) => {
    // load missing items (returns a Promise)
  };

  render() {
    const { list, rowCount } = this.state;

    return (
      <div>
        <ScrollLoader list={list} loadMore={this.loadMore} rowCount={rowCount} rowHeight={40}>
          {({ item, isEmpty, key, style }) => {
            if (isEmpty) {
              return <h4>Empty list</h4>;
            }

            if (!item) {
              // is loading
              return (
                <div key={key} style={style}>
                  loading
                </div>
              );
            }

            // loaded
            return (
              <div key={key} style={style}>
                {item.text}
              </div>
            );
          }}
        </ScrollLoader>
      </div>
    );
  }
}
```

<!-- start:scroll-loader -->

### API

#### children

> function(props: { item, isEmpty, key, style }) | **required**

Children function prop to define how to render each item of the list.

* item: Current item of the iteration, it can be null is the list is empty or is loading.
* isEmpty: Boolean that defines if the list is empty.
* key: Key of the current item.
* style: Style props required to apply in each item. **It's really important to use it, otherwise the scroll it's never going to work**

#### list

> Array | **required**

List of items already loaded.

#### rowCount

> number | **required**

Total count of items. This is necessary to create the entire list of items.

You can think about it like the sql
```sql
select count(*) from table
```
it doesn't matter if you loaded only the first 10 items.

#### loadMore

> function(props: { startIndex, stopIndex }) | **required** => Promise

This is a required callback to be invoked when more rows must be loaded
because `ScrollLoader` can't find some item in the list.

The returned Promise should be resolved once row data has finished loading. It will be used to determine
when to refresh the list with the newly-loaded data. This callback may be called multiple times
in reaction to a single scroll event.

#### rowHeight

> (number | function) | **required**

Either a fixed row height (number) or a function that returns the height of a
row given its index: `({ index: number }) => number`

#### findItem

> function({ index: number }) => (undefined | item)

Function to define how ScrollLoader is going to search each item on the list.

#### isRowLoaded

> function({ index: number }) => Boolean

Function responsible for tracking the loaded state of each row. By default it uses the `findItem` function.

#### width

> number

Set a fixed width for the list. If is undefined it will use `AutoSizer` to detect the width.

#### height

> number

Set a fixed height for the list. If is undefined it will use `AutoSizer` to detect the height.

#### rvInfiniteLoaderProps

> Object

Set options to the react-virtualized `InfiniteLoader` instance.

#### rvAutoSizerProps

> Object

Set options to the react-virtualized `AutoSizer` instance.

#### rvListProps

> Object

Set options to the react-virtualized `List` instance.

#### rvScrollProps

> Object

Set options to the `react-custom-scrollbars` instance.

<!-- end:scroll-loader -->

<!-- start:list -->

## <a name="list"></a> List

The `List` component it's just a wrapper around the Material-UI [List](https://material-ui.com/api/list/)
and our `ScrollLoader`.

So it has the same API of `Material-UI List` and the `ScrollLoader`.

> NOTE: react-virtualized needs that each component were **div** tags. So, we provide a
> wrapper for Material-UI [ListItem](https://material-ui.com/api/list-item/) component too.

### Usage

```jsx
import React, { Component } from 'react';
import { List, ListItem } from '@latticejs/infinite-list';

import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';

class App extends Component {
  ...
  render() {
    const { list, rowCount } = this.state;

    return (
      <Paper>
        <List list={list} loadMore={this.loadMore} rowCount={rowCount} rowHeight={40}>
          {({ item, isEmpty, key, style }) => {
            if (isEmpty) {
              return <h4>Empty list</h4>;
            }

            if (!item) {
              // is loading
              return (
                <ListItem key={key} style={style}>
                  <ListItemText primary="loading..." />
                </ListItem>
              );
            }

            // is loaded
            return (
              <ListItem key={key} style={style}>
                <ListItemText primary={item.text} />
              </ListItem>
            );
          }}
        </List>
      </Paper>
    );
  }
}
```

<!-- end:list -->
