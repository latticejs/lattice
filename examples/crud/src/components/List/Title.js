import React from 'react';
import { Typography } from '@material-ui/core';

export default ({ title }) => (
  <Typography variant="title" color="inherit" gutterBottom>
    {title}
  </Typography>
);
