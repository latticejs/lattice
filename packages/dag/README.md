# @latticejs/dag

A directed graph component based on d3. 

## Install

```bash
npm install @latticejs/dag
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
import { Dag } from '@latticejs/dag';

export class MyGraph extends React.Component {
  render () {
    const { nodes, edges, ...props } = this.props;
    return (
       <Dag nodes={nodes} edges={edges} {...props} />
    );
  }
}

```

## API

### editable

> `boolean` | defaults to `false`

Indicates if the `dag` can be edited, eg: new edges can be added. This mode endables extra functionality.

### onClickNode

> `function(event: Object)` | defaults to: `noOp`

Used to capture node selection event.

### onClickEdge

> `function(event: Object)` | defaults to: `noOp`

Used to capture edge selection event.

### onEdgeAdded

> `function(event: Object)` | defaults to: `noOp`

Used to create a new edge between node target and source. In order to work the `dag` needs the editable prop enabled.

## FAQs

// TBD
