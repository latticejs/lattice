import React from 'react';
import TextField from '@material-ui/core/TextField';
import { connect } from 'formik';

export default connect(({ formik, ...props }) => {
  const { values, touched, errors, handleChange, handleBlur } = formik;
  const { id } = props;

  const hasError = !!(touched[id] && errors[id]);

  return (
    <TextField
      error={hasError}
      helperText={hasError && errors[id]}
      value={values[id]}
      onChange={handleChange}
      onBlur={handleBlur}
      {...props}
    />
  );
});
