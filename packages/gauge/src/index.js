import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import classNames from 'classnames';
import { createArcs } from './gauge';
import Arc from './arc';
import Needle from './needle';

const styles = theme => ({
  gaugeRoot: {},
  gaugeColor1: {
    fill: '#6fbf73'
  },
  gaugeColor2: {
    fill: '#ffcd38'
  },
  gaugeColor3: {
    fill: '#ff6333'
  }
});

class Gauge extends Component {
  static displayName = 'Gauge';
  static defaultProps = {
    numSections: 3,
    padRad: 0.05,
    totalPercent: 0.75,
    width: 200,
    height: 200,
    barWidth: 40,
    percent: 0.5
  };

  render() {
    const { classes, percent } = this.props;
    const rootClasses = [classes];
    const arcs = createArcs({
      chartEl: this.gauge,
      container: this.gaugeContainer,
      ...this.props
    });
    return (
      <div className={classNames(rootClasses.gaugeRoot)}>
        <svg ref={node => (this.gaugeContainer = node)} width={200} height={200}>
          <g
            ref={node => (this.gauge = node)}
            className={classNames('lattice__gauge')}
            style={{ transform: `translate(${this.props.width / 2}px, ${this.props.height / 2}px)` }}
          >
            {arcs.map((data, i) => (
              <Arc key={`lattice__gauge-arc-${i}`} d={data()} arcClass={classNames(classes[`gaugeColor${i + 1}`])} />
            ))}
            <Needle len={70} radius={15} percent={percent} />
          </g>
        </svg>
      </div>
    );
  }
}

export default withStyles(styles, { name: 'Gauge' })(Gauge);
