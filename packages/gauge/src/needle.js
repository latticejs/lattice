import React, { Component } from 'react';
import { select } from 'd3-selection';
import 'd3-transition';
import { percToRad } from './utils';

export default class Needle extends Component {
  constructor(props) {
    super(props);
    const { len, radius } = props;
    this.len = len;
    this.radius = radius;
    this.perc = 0;
  }

  componentDidMount() {
    this.animateOn(this.chartEl, this.props.percent);
  }

  render() {
    return (
      <React.Fragment>
        <circle className="needle-center" cx={0} cy={0} r={this.radius} />
        <path ref={node => (this.needle = node)} className="needle" d={this.animate(this.perc)} />
      </React.Fragment>
    );
  }

  animateOn = (el, perc) => {
    const self = this;
    select('.lattice__gauge')
      .transition()
      .delay(500)
      .duration(3000)
      .select('.needle')
      .tween('progress', function() {
        return percentOfPercent => {
          const progress = percentOfPercent * perc;
          select(this).attr('d', self.animate(progress));
        };
      });
  };

  animate = perc => {
    const thetaRad = percToRad(perc) / 2; // half circle

    const centerX = 0;
    const centerY = 0;

    const topX = centerX - this.len * Math.cos(thetaRad);
    const topY = centerY - this.len * Math.sin(thetaRad);

    const leftX = centerX - this.radius * Math.cos(thetaRad - Math.PI / 2);
    const leftY = centerY - this.radius * Math.sin(thetaRad - Math.PI / 2);

    const rightX = centerX - this.radius * Math.cos(thetaRad + Math.PI / 2);
    const rightY = centerY - this.radius * Math.sin(thetaRad + Math.PI / 2);

    return `M ${leftX} ${leftY} L ${topX} ${topY} L ${rightX} ${rightY}`;
  };
}
