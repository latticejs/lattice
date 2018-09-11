# @latticejs/tree

List your data using a tree hierarchy.

## Install

`npm install @latticejs/tree`

## Usage

```jsx
import React, { Component } from 'react';
import Tree from '@latticejs/tree';

class App extends Component {
  state = {
    treeData: [
      {
        label: 'index.js'
      },
      {
        label: 'demo',
        children: [
          {
            label: 'file1.txt'
          },
          {
            label: 'file2.txt'
          },
          {
            label: 'examples',
            children: [
              {
                label: 'example1.js'
              }
            ]    
          }
        ]
      }
    ]    
  };
  
  render() {
    const { treeData } = this.state;
    return (
      <Tree 
        data={treeData}
        onCheckItem={(item) => console.log('Check: ', item)}
        onUnfoldItem={(item) => console.log('Unfold: ', item)}
        onFoldItem={(item) => console.log('Fold: ', item)}
      />
    )
  }
}
```

<!-- start:api -->

## API

### treeData

> `array<object>` | `required`

The data that will be parsed by the component used to render the tree structure. Input data is expected to have a tree-like structure (ie: to have `children`). This is the only required parameter. 

### expandedAll

> `boolean` | defaults to `false`

Used to show all the item containers unfolded by default.

### cascadeCheck

> `boolean` | defaults to `false`

Used to indicate if `check` action should be dispatched to all the childrens recursively.

### onCheckItem

> `function(check: boolean, items: [object])` | defaults to: `noOp`

Used as callback function to be called after one item is checked. It receives a boolean indicating checkbox state and the array of items affected (it can be recursive).

### onUnfoldItem

> `function(item: object)` | defaults to: `noOp`

The callback to be called after an unfold action happens. The function will be called with the affected item as a parameter.

### onFoldItem

> `function(item: object)` | defaults to: `noOp`

The callback to be called after a fold action happens. The function will be called with the affected item as a parameter.

### secondaryActions

> `Array<Function>` | defaults to: `[]`

Used to display Material UI secondary actions on every item. Every function will be called with the current `item` as a parameter.

### renderGenericItemCreator

> `function(props)` | defaults to: `renderGenericCreator`

Used to control how to parse input data and render parent/childrens. Default fn `renderGenericCreator`, uses a recursive approach calling other two default functions for rendering child (`TreeChild`) and parents (`TreeParent`).

### renderChildItem

> `function(props)` | defaults to: `TreeChild`

Used to control how an item is rendered.

### renderParentItem

> `function(props)` | defaults to: `TreeParent`

Used to control how to render parent elements.

### renderItemIcon

> `function({item: object, lvl: number, isExpanded: boolean})` | defaults to: `TreeItemIcon`

Used to control which icon render.

### getItemKey

> `function({item: object, lvl: number})` | defaults to: `lattice-tree-${item.label}-${lvl}`

Every item needs to have a unique key for maintaining sanity on the component internal state (checked and expanded). You can use this fn to overwrite the default key if your data structure is different to what is expected (see [Usage](##usage)).

<!-- end:api -->

## FAQs

TBD

