import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';

export const styles = theme => {
  const align = theme.direction === 'rtl' ? 'right' : 'left';

  return {
    /* Styles applied to the root element. */
    root: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      top: -5,
      left: 0,
      margin: 0,
      padding: 0,
      pointerEvents: 'none',
      borderRadius: theme.shape.borderRadius,
      borderStyle: 'solid',
      borderWidth: 1,
      // Match the Input Label
      transition: theme.transitions.create([`padding${align}`, 'border-color', 'border-width'], {
        duration: theme.transitions.duration.shorter,
        easing: theme.transitions.easing.easeOut
      }),
      paddingLeft: '8px'
    },
    /* Styles applied to the legend element. */
    legend: {
      textAlign: 'left',
      padding: 0,
      lineHeight: '10px',
      transition: theme.transitions.create('width', {
        duration: theme.transitions.duration.shorter,
        easing: theme.transitions.easing.easeOut
      })
    }
  };
};

/**
 * @ignore - internal component.
 */
class NotchedOutline extends Component {
  componentDidMount() {
    if (this.props.variant === 'outlined') {
      this.forceUpdate();
    }
  }
  render() {
    const {
      children,
      classes,
      classLabel,
      id,
      className,
      notched,
      style,
      theme,
      labelValue,
      labelOnClick,
      shrink,
      ...other
    } = this.props;

    const align = theme.direction === 'rtl' ? 'right' : 'left';
    const labelWidth = this.labelRef && this.labelRef.clientWidth > 0 ? this.labelRef.clientWidth * 0.75 + 8 : 0;

    return (
      <fieldset
        aria-hidden
        style={{
          [`padding${align}`]: 8 + (notched ? 0 : labelWidth / 2),
          ...style
        }}
        className={classNames(classes.root, className)}
        {...other}
      >
        <legend
          className={classes.legend}
          style={{
            // IE 11: fieldset with legend does not render
            // a border radius. This maintains consistency
            // by always having a legend rendered
            width: notched ? labelWidth : 0.01
          }}
        >
          {/* Use the nominal use case of the legend, avoid rendering artefacts. */}
          {/* eslint-disable-next-line react/no-danger */}
          <label ref={node => (this.labelRef = node)} htmlFor={id} onClick={labelOnClick} className={classLabel}>
            {labelValue}
          </label>
          <span dangerouslySetInnerHTML={{ __html: '&#8203;' }} />
        </legend>
      </fieldset>
    );
  }
}

NotchedOutline.propTypes = {
  /**
   * Override or extend the styles applied to the component.
   * See [CSS API](#css-api) below for more details.
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * If `true`, the outline is notched to accommodate the label.
   */
  notched: PropTypes.bool.isRequired,
  /**
   * @ignore
   */
  style: PropTypes.object,
  /**
   * @ignore
   */
  theme: PropTypes.object,
  labelValue: PropTypes.string
};

export default withStyles(styles, { name: 'LatticePrivateNotchedOutline', withTheme: true })(NotchedOutline);
