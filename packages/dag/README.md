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

// TBD

## FAQs

// TBD
