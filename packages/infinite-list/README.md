# @latticejs/infinite-list

A set of [material-ui](https://material-ui.com/) components adapted to support infinite list feature.

## Table of contents

- [Install](#install)
- [ScrollLoader](#scroll-loader)
- [List](#list)
- [Table](#table)
  - [TableBody](#table-body)
  - [TableOrderCell](#table-order-cell)
  - [TableSearchCell](#table-search-cell)

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
import React, { Component } from "react";
import { ScrollLoader } from "@latticejs/infinite-list";

class App extends Component {
  state = {
    // loaded items
    list: [{ text: "item 1" }, { text: "item 2" }],
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
        <ScrollLoader
          list={list}
          loadMore={this.loadMore}
          rowCount={rowCount}
          rowHeight={40}
        >
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

> `function(props: { item, isEmpty, key, style })` | _required_

Children function prop to define how to render each item of the list.

- item: Current item of the iteration, it can be null is the list is empty or is loading.
- isEmpty: Boolean that defines if the list is empty.
- key: Key of the current item.
- style: Style props required to apply in each item. **It's really important to use it, otherwise the scroll it's never going to work**

#### list

> `Array` | _required_

List of items already loaded.

#### rowCount

> `number` | _required_

Total count of items. This is necessary to create the entire list of items.

You can think about it like the sql

```sql
select count(*) from table
```

it doesn't matter if you loaded only the first 10 items.

#### loadMore

> `function(props: { startIndex, stopIndex })` => Promise | _required_

This is a required callback to be invoked when more rows must be loaded
because `ScrollLoader` can't find some item in the list.

The returned Promise should be resolved once row data has finished loading. It will be used to determine
when to refresh the list with the newly-loaded data. This callback may be called multiple times
in reaction to a single scroll event.

#### rowHeight

> `(number | function)` | _required_

Either a fixed row height (number) or a function that returns the height of a
row given its index: `({ index: number }) => number`

#### findItem

> `function({ index: number }) => (undefined | item)` | defaults to: `({ index }) => list[index]`

Function to define how ScrollLoader is going to search each item on the list.

#### isRowLoaded

> `function({ index: number }) => Boolean` | defaults to: `({ index }) => !!findItem({ index })`

Function responsible for tracking the loaded state of each row. By default it uses the `findItem` function.

#### width

> `number` | defaults to the `parent width`

Set a fixed width for the list. If it is undefined it will use `AutoSizer` to detect the width.

#### height

> `number` | defaults to the `parent height`

Set a fixed height for the list. If it is undefined it will use `AutoSizer` to detect the height.

#### rvInfiniteLoaderProps

> `object` | defaults to `{}`

Set options to the react-virtualized `InfiniteLoader` instance.

#### rvAutoSizerProps

> `object` | defaults to `{}`

Set options to the react-virtualized `AutoSizer` instance.

#### rvListProps

> `object` | defaults to `{}`

Set options to the react-virtualized `List` instance.

#### rvScrollProps

> `object` | defaults to `{}`

Set options to the `react-custom-scrollbars` instance.

<!-- end:scroll-loader -->

<!-- start:list -->

## <a name="list"></a> List

The `List` component it's just a wrapper around the Material-UI [List](https://material-ui.com/api/list/)
and our `ScrollLoader`.

So it has the same API of `Material-UI List` and the `ScrollLoader`.

> NOTE: react-virtualized needs that each component were **div** tags. So, we provide a
> wrapper for Material-UI [ListItem](https://material-ui.com/api/list-item/) and [ListItemSecondaryAction](https://material-ui.com/api/list-item-secondary-action/) components too.

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

<!-- start:table -->

## <a name="table"></a> Table

Lattice's Table component provides support for displaying tabulated data with `infinite data loading` support.

Since _react-virtualized_ needs that each component were **div** tags we need to create wrappers
and apply some custom styles for the next `Material-UI` components:

- [Table](https://material-ui.com/api/table/)
- [TableBody](https://material-ui.com/api/table-body/)
- [TableCell](https://material-ui.com/api/table-cell/)
- [TableHead](https://material-ui.com/api/table-head/)
- [TableRow](https://material-ui.com/api/table-row/)

<!-- end:table -->

<!-- start:table-body -->

## <a name="table-body"></a> TableBody

The `TableBody` is a special component created on top of the ScrollLoader, the idea is that in general
the `tbody` represents a tag where you render inside a `list`, in this case an infinite loader list.

You can use the entire API of the ScrollLoader.

### Usage

```jsx
import React, { Component } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@latticejs/infinite-list';

import Paper from '@material-ui/core/Paper';

class App extends Component {
  ...
  render() {
    const { list, rowCount } = this.state;

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
            list={list}
            loadMore={this.loadMore}
            rowCount={rowCount}
            rowHeight={48}
            height={200}
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
```

<!-- end:table-body -->

<!-- start:table-order-cell -->

## <a name="table-order-cell"></a> TableOrderCell

Component created on top of `TableCell`, `TableSortLabel` and `Tooltip` to provide an easy way of create
a table order cell.

It supports multiple orders using `shift + click` out of the box.

You can use Material-UI TableCell API.

### Usage

```jsx
import React, { Component } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableOrderCell
} from "@latticejs/infinite-list";

import Paper from "@material-ui/core/Paper";

class App extends Component {
  state = {
    orderBy: []
  };

  handleOrder = orderBy => {
    this.setState({ orderBy });
  };

  render() {
    const { orderBy } = this.state;

    return (
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Index</TableCell>
              <TableOrderCell
                field="title"
                title="Title"
                orderBy={orderBy}
                handleOrder={this.handleOrder}
              />
              <TableOrderCell
                field="timestamp"
                title="Timestamp"
                orderBy={orderBy}
                handleOrder={this.handleOrder}
              />
            </TableRow>
          </TableHead>
        </Table>
      </Paper>
    );
  }
}
```

### API

#### field

> `string` | _required_

The field prop is required to create an Array of `orderBy`.

#### orderBy

> `Array<Order>` | _required_

> `Order: { field: string, direction: ('asc'|'desc') }`

The orderBy is the current `Order` object list of your table state.

#### handleOrder

> `function(orderBy: [])` | _required_

Callback function called when there is a new order.

#### multiSort

> `boolean` | defaults to: `true`

Used to indicate if multiple orders are allowed.

#### title

> `string` | defaults to: ''

The title will be used by the `Tooltip` component.

<!-- end:table-order-cell -->

<!-- start:table-search-cell -->

## <a name="table-search-cell"></a> TableSearchCell

Component on top of `TableCell` to provide an easy way to create a table search cell.

It supports input debounce out of the box.

Since extends from the Material-UI `TableCell` you can use their API.

### Usage

```jsx
import React, { Component } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableSearchCell
} from "@latticejs/infinite-list";

import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";

class App extends Component {
  state = {
    filterBy: []
  };

  handleSearch = filterBy => {
    this.setState({ filterBy });
  };

  render() {
    const { orderBy } = this.state;

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
              <TableSearchCell
                field="name"
                debounce={200}
                filterBy={filterBy}
                handleSearch={this.handleSearch}
              >
                {({ inputProps }) => <Input fullWidth {...inputProps} />}
              </TableSearchCell>
              <TableSearchCell
                field="email"
                filterBy={filterBy}
                handleSearch={this.handleSearch}
              >
                {({ inputProps }) => <Input fullWidth {...inputProps} />}
              </TableSearchCell>
            </TableRow>
          </TableHead>
        </Table>
      </Paper>
    );
  }
}
```

### API

#### field

> `string` | _required_

The field prop is required to create an Array of `filterBy`.

#### filterBy

> `Array<Filter>` | _required_

> `Filter: { field: string, value: string }`

The filterBy is the current `Filter` object list of your table state.

#### handleSearch

> `function(filterBy: [])` | _required_

Callback function called when there is a new filter.

#### children

> `function(props: SearchProps)` | _required_

> `SearchProps: { inputProps: { name: string, value: string, onChange: function }, updateValue: function }`

- inputProps: Set of props for an input component that has an `onChange` and `value` prop.
- updateValue: Function to use in case of input component doesn't have `onChange` support.

#### debounce

> `number` | defaults to: `300`

Set the time that the `TableSearchCell` has to wait during an input `onchange` event
before to run the `handleSearch` callback.

<!-- end:table-search-cell -->
