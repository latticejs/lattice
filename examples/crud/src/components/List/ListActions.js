import React from 'react';
import { compose, withHandlers } from 'recompose';
import { Grid, Button } from '@material-ui/core';
import SelectAllButton from './SelectAllButton';
import SelectionInfo from './SelectionInfo';
import Filter from './Filter';
import Sort from './Sort';
import AddButton from './AddButton';

const enhanceListActions = compose(
  withHandlers({
    onChange: ({ selectAllOnSelectAll, selectAllOnUnselectAll }) => (e, checked) =>
      checked ? selectAllOnSelectAll() : selectAllOnUnselectAll()
  })
);

export default enhanceListActions(
  ({
    addButtonTitle,
    onAdd,
    onChange,
    selectAllDisabled,
    selectAllChecked,
    selectedItems,
    selectionOnDelete,
    selectionOnActivate,
    selectionOnDeactivate,
    sortItems,
    sortOrder,
    sortProperty,
    sortOrderOnChange,
    sortPropertyOnChange,
    filterOnChange
  }) => {
    return (
      <Grid container direction="row" justify="flex-start" alignItems="center">
        <Grid item>
          <SelectAllButton onChange={onChange} checked={selectAllChecked} disabled={selectAllDisabled} />
        </Grid>
        <Grid item xs={4} container alignItems="center" spacing={2}>
          {selectedItems > 0 && (
            <React.Fragment>
              <Grid item xs={3} container justify="center">
                <SelectionInfo selectedCount={selectedItems} />
              </Grid>
              <Grid item container spacing={1} xs>
                <Grid item>
                  <Button variant="outlined" color="secondary" onClick={selectionOnDelete}>
                    Delete
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary" onClick={selectionOnActivate}>
                    Activate
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" onClick={selectionOnDeactivate}>
                    Deactivate
                  </Button>
                </Grid>
              </Grid>
            </React.Fragment>
          )}
        </Grid>
        <Grid item xs container justify="center">
          <Filter onChange={filterOnChange} />
        </Grid>
        <Grid item xs={3} container justify="flex-end">
          <Sort
            sortItems={sortItems}
            sortProperty={sortProperty}
            sortOrder={sortOrder}
            sortOrderOnChange={sortOrderOnChange}
            sortPropertyOnChange={sortPropertyOnChange}
          />
        </Grid>
        <Grid item>
          <AddButton onClick={onAdd}>{addButtonTitle}</AddButton>
        </Grid>
      </Grid>
    );
  }
);
