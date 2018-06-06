import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  rootChart: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    color: theme.palette.text.primary
  }
});

export default WrappedChart => {
  return withStyles(styles, { withTheme: true })(
    class extends Component {
      static displayName = `MuiRechart(${WrappedChart.displayName || WrappedChart.name})`;

      applyStyleFor(element) {
        const { theme } = this.props;
        const {
          type: { displayName }
        } = element; // TODO: check this in prod build

        switch (displayName) {
          case 'Tooltip': {
            const {
              props: { wrapperStyle }
            } = element;
            return {
              wrapperStyle: {
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.secondary,
                border: 'none',
                boxShadow: theme.shadows[1],
                ...wrapperStyle
              }
            };
          }
          case 'XAxis':
          case 'YAxis':
          case 'ZAxis':
          case 'PolarAngleAxis':
          case 'PolarRadiusAxis': {
            const {
              props: { stroke }
            } = element;
            return {
              stroke: stroke || theme.palette.text.secondary
            };
          }
          default:
            return {};
        }
      }

      renderStyled(children) {
        return React.Children.map(children, child =>
          React.cloneElement(child, {
            ...this.applyStyleFor(child)
          })
        );
      }

      render() {
        const { classes, children } = this.props;
        return (
          <WrappedChart {...this.props} className={classes.rootChart}>
            {this.renderStyled(children)}
          </WrappedChart>
        );
      }
    }
  );
};
