import React from 'react';
import { connect } from 'formik';
import classNames from 'classnames';

import MuiTextField from '@material-ui/core/TextField';
import MuiButton from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

// colors
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

export const TextField = connect(({ formik, children, loading, ...props }) => {
  const { values, touched, errors, handleChange, handleBlur, isSubmitting } = formik;
  const { field } = props;

  const hasError = !!(touched[field] && errors[field]);

  return (
    <MuiTextField
      error={hasError}
      helperText={hasError && errors[field]}
      value={values[field]}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={isSubmitting}
      name={field}
      {...props}
    >
      {loading && <CircularProgress size={24} />}
      {!loading && children}
    </MuiTextField>
  );
});

const stylesButton = theme => ({
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700]
    }
  },
  buttonError: {
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[700]
    }
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
});

export const Button = connect(
  withStyles(stylesButton)(({ formik, ...props }) => {
    const { isValid, isSubmitting, submitCount } = formik;
    const { classes, children, className, ...restProps } = props;

    const buttonClassname = classNames(
      {
        [classes.buttonSuccess]: submitCount > 0 && isValid,
        [classes.buttonError]: submitCount > 0 && !isValid
      },
      className
    );

    return (
      <MuiButton className={buttonClassname} disabled={isSubmitting} {...restProps}>
        {children}
        {isSubmitting && <CircularProgress size={24} className={classes.buttonProgress} />}
      </MuiButton>
    );
  })
);
