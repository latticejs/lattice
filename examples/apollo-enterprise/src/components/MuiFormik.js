import React from 'react';
import { connect } from 'formik';
import classNames from 'classnames';

import MuiTextField from '@material-ui/core/TextField';
import MuiButton from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import { withStyles } from '@material-ui/core/styles';

export const TextField = connect(({ formik, children, loading, ...props }) => {
  const { values, touched, errors, handleChange, handleBlur, isSubmitting } = formik;
  const { field, InputProps = {} } = props;

  const hasError = !!(touched[field] && errors[field]);

  const _InputProps = {
    ...InputProps,
    startAdornment: loading && (
      <InputAdornment position="start">
        <CircularProgress size={24} />
      </InputAdornment>
    )
  };

  return (
    <MuiTextField
      error={hasError}
      helperText={hasError && errors[field]}
      value={values[field]}
      onChange={handleChange(field)}
      onBlur={handleBlur(field)}
      disabled={isSubmitting}
      name={field}
      InputProps={_InputProps}
      {...props}
    >
      {children}
    </MuiTextField>
  );
});

const stylesButton = theme => ({
  buttonError: {
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.dark
    },
    color: theme.palette.error.contrastText
  },
  buttonProgress: {
    color: theme.palette.primary.main,
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
    const { classes, type, children, className, ...restProps } = props;

    const buttonClassname = classNames(
      {
        [classes.buttonError]: submitCount > 0 && !isValid
      },
      className
    );

    return (
      <MuiButton type={type} className={buttonClassname} disabled={isSubmitting} {...restProps}>
        {children}
        {isSubmitting && type === 'submit' && <CircularProgress size={24} className={classes.buttonProgress} />}
      </MuiButton>
    );
  })
);
