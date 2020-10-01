import React, { Component } from 'react';
import LatticeSunburst from '@latticejs/recharts-sunburst';
import { Tooltip } from '@latticejs/mui-recharts';
import { evaluateChartData } from '../helper/helper';

class Sunburst extends Component {
  constructor(props) {
    super(props);

    const completeInfo = evaluateChartData(true);
    this.sunburstData = completeInfo.data;
    this.colorArray = completeInfo.colorArray;
  }

  render() {
    return (
      <LatticeSunburst
        data={this.sunburstData}
        dataKey="size"
        colors={this.colorArray}
        width={window.innerWidth / 2.2}
        height={window.innerHeight - 315}
        isAnimationActive={false}
      >
        <Tooltip />
      </LatticeSunburst>
    );
  }
}

export default Sunburst;
