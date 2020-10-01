import { Grid, MenuItem } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { InputLabel } from '@material-ui/core';
import { Select } from '@material-ui/core';
import React from 'react';

const SortPropertySelect = ({ sortItems = [], value, onChange }) => (
  <FormControl fullWidth>
    <InputLabel htmlFor="sort-property">Sort</InputLabel>
    <Select
      value={value}
      onChange={onChange}
      inputProps={{
        name: 'sort-property',
        id: 'sort-property',
      }}
    >
      {sortItems.map((sortItem) => {
        let value, label;
        if (typeof sortItem === 'string') {
          label = sortItem;
          value = sortItem.toLowerCase();
        } else {
          label = Object.keys(sortItem)[0];
          value = sortItem[label];
        }

        return (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        );
      })}
    </Select>
  </FormControl>
);

const SortOrderSelect = ({ value, onChange }) => (
  <FormControl fullWidth>
    <InputLabel htmlFor="sort-order">Order</InputLabel>
    <Select
      value={value}
      onChange={onChange}
      inputProps={{
        name: 'sort-order',
        id: 'sort-order',
      }}
    >
      <MenuItem value="asc">Asc</MenuItem>
      <MenuItem value="desc">Desc</MenuItem>
    </Select>
  </FormControl>
);

export default ({ sortItems, sortProperty, sortOrder = 'asc', sortOrderOnChange, sortPropertyOnChange }) => (
  <Grid item xs container spacing={2}>
    <Grid item xs={9}>
      <SortPropertySelect sortItems={sortItems} value={sortProperty} onChange={sortPropertyOnChange} />
    </Grid>
    <Grid item xs={3}>
      <SortOrderSelect value={sortOrder} onChange={sortOrderOnChange} />
    </Grid>
  </Grid>
);
