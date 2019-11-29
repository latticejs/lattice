# @latticejs/ag-grid

A directed graph component based on d3. 

## Install

```bash
npm install @latticejs/ag-grid
```


## Usage

The graph will expect nodes and edges as input. 

Nodes and edges have the following structure: 

```javascript
nodes: [
    { title: 'Task A' },
    { title: 'Task B' }
]
edges: [
    { 
        source: 'Task A',
        target: 'Task B'
    }
]
```

**Note**: since this is a svg component `width` and `height` properties are required.

### Example:  

```javascript
import React from 'react';
import { LatticeAgGrid } from '@latticejs/ag-grid';

export class MyGraph extends React.Component {
  render () {
    const { nodes, edges, ...props } = this.props;
    return (
       <LatticeAgGrid nodes={nodes} edges={edges} {...props} />
    );
  }
}
