import React from 'react';
import Types from 'prop-types';

import { TextField } from '@material-ui/core';

const TextInput = ({ type = 'text', error, ...props }) => {
  return (
    <TextField
      {...props}
      type={type}
      error={Boolean(error)}
      FormHelperTextProps={{ error: Boolean(error) }}
      helperText={error}
    />
  );
};

TextInput.propTypes = {
  type: Types.string,
  error: Types.string
};

export default TextInput;
