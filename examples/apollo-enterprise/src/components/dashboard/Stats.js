import React from 'react';
import classnames from 'classnames';
// Material UI
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
// Lattice
import { Widget } from '@latticejs/widgets';

const styles = theme => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      'min-height': 145
    }
  },
  revenue: {
    'border-color': '#0088FE'
  },
  followers: {
    'border-color': '#00C49F'
  },
  mentions: {
    'border-color': '#FFBB28'
  },
  visitors: {
    'border-color': '#FF8042'
  }
});

const reduceValue = value => (value > 1000 ? `${Math.floor(value / 1000)}k` : `${value}`);

const Stats = ({ stat: { label, value, unit }, ...props }) => {
  const { classes, classNames } = props;
  return (
    <Widget
      title={label}
      className={classnames([classNames, classes.root])}
      border="bottom"
      classes={{ border: classes[label.toLowerCase()] }}
    >
      <Typography variant="h3" align="center">
        {reduceValue(value)}
      </Typography>
      <Typography variant="caption" align="center">
        {unit}
      </Typography>
    </Widget>
  );
};

export default withStyles(styles)(Stats);
