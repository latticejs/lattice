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
        expanded: true,
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

## API

## FAQs

TBD

