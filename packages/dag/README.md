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

:arrow_right: Also, take a look to the `dag` stories.


## API

### editable

> `boolean` | defaults to `false`

Indicates if the `dag` can be edited, eg: new edges can be added. This mode endables extra functionality.

### onNodeClick

> `function(node: Object)` | defaults to: `noOp`

Used to get the selected node. Click on a node also adds the `selectedNodeClass` to target node. See exported `DAG_DEFAULTS` object.

### onEdgeClick

> `function(edge: Object)` | defaults to: `noOp`

Used to get the selected edge. Click on an edge also adds the `selectedEdgeClass` to target edge. See exported `DAG_DEFAULTS` object.

### onEdgeAdded

> `function(edge: Object)` | defaults to: `noOp`

Used to create a new edge between node target and source. In order to work the `dag` needs the `editable` prop enabled. When the user clicks on a node, a new _panel_ will appear where they can select actions to trigger. If they select to create a new edge, then a new "ghost edge" will show representing a new connection between nodes. Initial node will be the **source**. The cb function will be called when a different node (**target**) is clicked.
`edge` parameter looks like this:

```javascript
// edge parameter description
{ source: String, target: String }
```

### onNodeAdded

> `function(node: Object)` | defaults to: `noOp`

Used to create a new node. Only works on `editable` mode. To trigger the new node creation the user will need to doubleClick on the graph component. This shows a new editable node. Cancel with `ESC` key, confirm with `ENTER`. After confirmation, this function will be called with a object like this:

```javascript
// node parameter description
{ title: String, x: Number, y: Number}
```
Where `x` and `y` are the coords where the user double clicked.

### onNodeRemoved

> `function(nodes: Array)` | defaults to: `noOp`

Used to remove selected node. On `editable` mode, click on a node opens a _panel_ for trigger specific component actions, ie: remove element, add edge, etc. 

When remove-node-action is executed this cb function will be called with a copy of input `nodes` **excluding** selected node.

### onEdgeRemoved

> `function(edges: Array)` | defaults to `noOp`

Used to remove selected edge. On `editable` mode, click on an edge opens a _panel_ for trigger specific component actions, ie: remove element, etc.

When remove-edge-action is executed this cb function will be called with a copy of input `edges` **excluding** selected edge.

## FAQs

// TBD
