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

Also, take a look to the `dag` stories.


## API

### editable

> `boolean` | defaults to `false`

Indicates if the `dag` can be edited, eg: new edges can be added. This mode endables extra functionality.

### onNodeClick

> `function(event: Object)` | defaults to: `noOp`

Used to capture node selection event.

### onEdgeClick

> `function(event: Object)` | defaults to: `noOp`

Used to capture edge selection event.

### onEdgeAdded

> `function(edge: Object)` | defaults to: `noOp`

Used to create a new edge between node target and source. In order to work the `dag` needs the `editable` prop enabled. When the user click on a node, a new "ghost edge" will appear representing the new edge. The function will be called when a different node is clicked. Cancelling the effect otherwise.
`edge` parameter looks like this:

```javascript
// edge parameter description
{ source:String, target: String }
```

### onNodeAdded

> `function(node: Object)` | defaults to: `noOp`

Used to create a new node. Only works on `editable` mode. To trigger the new node creation the user will need to doubleClick on the graph component. This shows a new editable node. Cancel with `ESC` key, confirm with `ENTER`. After confirmation, this function will be called with a object like this:

```javascript
// node parameter description
{ title: String, x: Number, y: Number}
```
Where `x` and `y` are the coords where the user double clicked.

## FAQs

// TBD
