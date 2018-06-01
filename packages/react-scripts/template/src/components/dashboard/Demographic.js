import React, { Component } from 'react';
import classnames from 'classnames';
// Material-UI
import { withStyles } from '@material-ui/core/styles';

import { ResponsiveContainer } from 'recharts';
// Lattice
import Widget from '@latticejs/widgets/Widget';
import Sunburst from '@latticejs/recharts-sunburst';

const COLORS = {
  fill: '#00C49F',
  stroke: '#fff'
}

const styles = theme => ({
  root: {
    minHeight: 300
  },
  progress: {
    margin: '5px 0'
  }
});

const defaultData = [
  {
    children: [
      { name: 'Data', size: 20544 },
      { name: 'DataList', size: 19788 },
      { name: 'DataSprite', size: 10349 },
      { name: 'EdgeSprite', size: 3301 },
      { name: 'NodeSprite', size: 19382 },
      {
        name: 'render',
        children: [
          { name: 'ArrowType', size: 698 },
          { name: 'EdgeRenderer', size: 5569 },
          { name: 'IRenderer', size: 353 },
          { name: 'ShapeRenderer', size: 2247 },
        ],
      },
      { name: 'ScaleBinding', size: 11275 },
      { name: 'Tree', size: 7147 },
      { name: 'TreeBuilder', size: 9930 },
    ],
  },
];

class Demographic extends Component {

  render () {
    const { className, width, height, classes, data = defaultData, fill = COLORS.fill, stroke = COLORS.stroke } = this.props

    return (
      <Widget title="Demographic" {...this.props}>
        <ResponsiveContainer aspect={1}>
          <Sunburst
            width={width}
            height={height}
            data={data}
            dataKey='size'
            className={classnames(className, classes.root)}
            fill={fill}
            stroke={stroke}
          />
        </ResponsiveContainer>
      </Widget>
    )
  }
}

export default withStyles(styles)(Demographic);
