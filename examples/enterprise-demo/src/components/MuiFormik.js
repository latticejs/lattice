import React from 'react';
import { connect } from 'formik';
import classNames from 'classnames';

import MuiTextField from '@material-ui/core/TextField';
import MuiButton from '@material-ui/core/Button';
import MuiGrid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

// colors
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

export const TextField = connect(({ formik, ...props }) => {
  const { values, touched, errors, handleChange, handleBlur, isSubmitting } = formik;
  const { id } = props;

  const hasError = !!(touched[id] && errors[id]);

  return (
    <MuiTextField
      error={hasError}
      helperText={hasError && errors[id]}
      value={values[id]}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={isSubmitting}
      {...props}
    />
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
    const { submitForm, resetForm, isValid, isSubmitting, submitCount } = formik;
    const { type = 'submit', classes, children, ...restProps } = props;

    const buttonClassname = classNames({
      [classes.buttonSuccess]: submitCount > 0 && isValid,
      [classes.buttonError]: submitCount > 0 && !isValid
    });

    return (
      <MuiButton
        className={buttonClassname}
        disabled={isSubmitting}
        onClick={() => {
          type === 'submit' ? submitForm() : resetForm();
        }}
        {...restProps}
      >
        {children}
        {isSubmitting && <CircularProgress size={24} className={classes.buttonProgress} />}
      </MuiButton>
    );
  })
);

const stylesForm = theme => ({
  containerForm: {
    padding: 20
  }
});

export const Form = connect(
  withStyles(stylesForm)(({ formik, children, classes, ...props }) => {
    const { handleSubmit } = formik;

    return (
      <MuiGrid item xs={12} sm={8} className={classes.containerForm}>
        <MuiGrid
          component="form"
          autoComplete="off"
          onSubmit={handleSubmit}
          container
          alignContent="center"
          justify="center"
          spacing={40}
          {...props}
        >
          {children}
        </MuiGrid>
      </MuiGrid>
    );
  })
);
