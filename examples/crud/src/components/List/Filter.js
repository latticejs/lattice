import React from 'react';
import { FormControl, InputLabel, Input, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const Filter = ({ onChange, filter = '' }) => {
  return (
    <FormControl fullWidth>
      <InputLabel htmlFor="adornment-filter">Search</InputLabel>
      <Input
        id="adornment-filter"
        type={'search'}
        value={filter}
        onChange={onChange}
        endAdornment={
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

export default Filter;
