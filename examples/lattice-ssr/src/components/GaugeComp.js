import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Gauge from '@latticejs/gauge';
import { Grid } from '@material-ui/core';
import { Widget } from '@latticejs/widgets';
import classnames from 'classnames';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flexGrow: 1
  },
  mainContainer: {
    backgroundColor: '#898989',
    height: '100%'
  }
});

class GaugeComp extends Component {
  constructor(props) {
    super(props);

    this.customGauge = {
      units: 'mph',
      width: 300,
      height: 300,
      barWidth: '5',
      barShadow: '0',
      borderShadowWidth: '20',
      borderInnerWidth: '0',
      borderOuterWidth: '0',
      borderMiddleWidth: '0',
      highlights: 'false',
      valueBoxStroke: '0',
      needleWidth: '3',
      animateOnInit: 'true',
      animatedValue: 'true',
      animationDuration: '1500',
      animationRule: 'linear',
      colorValueBoxShadow: '0',
      valueBoxBorderRadius: '0',
      valueTextShadow: '0',
      needleType: 'arrow',
      colorValueBoxBackground: 'transparent'
    };
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid container className={classes.mainContainer}>
        <Grid item xs={12}>
          <Widget title="Gauge">
            <center className={classnames(classes.mainContainerSB)}>
              <Gauge value={30} settings={this.customGauge} />
            </center>
          </Widget>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(GaugeComp);
