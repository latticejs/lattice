import React, { Component } from 'react';
import { Cell, PieChart, Pie, Tooltip } from '@latticejs/mui-recharts';
import { evaluateChartData } from '../helper/helper';

class Chart extends Component {
  constructor(props) {
    super(props);

    const completeData = evaluateChartData(false);
    this.colorArray = completeData.colorArray;
    this.pieChartData = completeData.data;

    this.getStateColorsView = this.getStateColorsView.bind(this);
    this.tooltipFormat = this.tooltipFormat.bind(this);
  }

  /**
   * Return State color object for each cell.
   */
  getStateColorsView() {
    const colorSet = [];

    for (const state in this.colorArray) {
      colorSet.push(<Cell fill={this.colorArray[state]} />);
    }

    return colorSet;
  }

  /**
   * Change the Tooltip value text, added % in tooltip value.
   */
  tooltipFormat(value, name) {
    return `${value}%`;
  }

  render() {
    const colorBand = this.getStateColorsView();
    return (
      <PieChart width={window.innerWidth / 2.2} height={window.innerHeight - 315}>
        <Pie
          dataKey="percentage"
          isAnimationActive={false}
          colors={this.colorArray}
          data={this.pieChartData}
          cx="50%"
          cy="50%"
          innerRadius={20}
          startAngle={90}
          endAngle={450}
          outerRadius={window.innerWidth / 7}
        >
          {colorBand}
        </Pie>
        <Tooltip formatter={this.tooltipFormat} />
      </PieChart>
    );
  }
}

export default Chart;
