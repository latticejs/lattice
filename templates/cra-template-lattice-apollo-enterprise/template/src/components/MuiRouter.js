import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@material-ui/core/Button';

export const Link = ({ children, ...props }) => (
  <Button component={RouterLink} {...props}>
    {children}
  </Button>
);
