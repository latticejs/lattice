import React, { Component } from 'react';
// Recharts
import { ResponsiveContainer } from 'recharts';
// Lattice
import Widget from '@lattice/widgets/Widget';
import Dag from '@lattice/dag';

const data = {
  nodes: [
    {title: 'Task A'},
    {title: 'Task B'},
    {title: 'Task C'},
    {title: 'Task D'},
    {title: 'Task E'},
    {title: 'Task F'},
    {title: 'Task G'},
  ],
  edges: [
    {source: 'Task A', target: 'Task B'},
    {source: 'Task A', target: 'Task C'},
    {source: 'Task B', target: 'Task C'},
    {source: 'Task B', target: 'Task E'},
    {source: 'Task C', target: 'Task D'},
    {source: 'Task E', target: 'Task F'},
    {source: 'Task E', target: 'Task G'},
  ]
};

class TaskScheduler extends Component {
  render () {
    return (
      <Widget title="Task Scheduler">
        <ResponsiveContainer aspect={2}>
          <Dag {...data} />
        </ResponsiveContainer>
      </Widget>
    );
  }
}

export default TaskScheduler;
