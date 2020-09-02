import React from 'react';

// Material-UI
import TableFooter from '@material-ui/core/TableFooter';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';

// @latticejs
import { Widget } from '@latticejs/widgets';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableOrderCell,
  TableSearchCell,
} from '@latticejs/infinite-list';

const styles = (theme) => ({
  root: {
    overflowX: 'auto',
  },
  avatarCell: {
    width: 100,
  },
  avatar: {
    margin: 10,
    height: 60,
    width: 60,
  },
  cell: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  footer: {
    padding: 10,
    textAlign: 'right',
  },
});

const dataGrid = (props) => {
  const handleRowClick = (employee) => {
    const { handleSelect } = props;

    handleSelect(employee);
  };

  const {
    dataLoaderRef,
    scrollRef,
    totalCount,
    list,
    classes,
    filterBy,
    orderBy,
    handleLoadMore,
    findItem,
    handleOrder,
    handleSearch,
    handleScrollStop,
  } = props;

  return (
    <Widget className={classes.root}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableOrderCell
              field="name"
              title="Name"
              className={classes.cell}
              orderBy={orderBy}
              handleOrder={handleOrder}
            />
            <TableOrderCell
              field="email"
              title="Email"
              className={classes.cell}
              handleOrder={handleOrder}
              orderBy={orderBy}
            />
          </TableRow>
          <TableRow>
            <TableCell />
            <TableSearchCell field="name" debounce={200} filterBy={filterBy} handleSearch={handleSearch}>
              {({ inputProps }) => <Input fullWidth {...inputProps} />}
            </TableSearchCell>
            <TableSearchCell field="email" filterBy={filterBy} handleSearch={handleSearch}>
              {({ inputProps }) => <Input fullWidth {...inputProps} />}
            </TableSearchCell>
          </TableRow>
        </TableHead>
        <TableBody
          loadMore={handleLoadMore}
          findItem={findItem}
          list={list}
          rowCount={totalCount}
          rowHeight={48}
          height={500}
          rvInfiniteLoaderProps={{
            ref: dataLoaderRef,
          }}
          rvScrollProps={{
            ref: scrollRef,
            onScrollStop: handleScrollStop,
          }}
        >
          {({ item, isEmpty, key, style }) => {
            if (isEmpty) {
              return (
                <Grid container spacing={4} alignItems="center" justify="center">
                  <h4>Empty list...</h4>
                </Grid>
              );
            }

            if (!item) {
              return (
                <TableRow key={key} style={style}>
                  <TableCell className={classes.cell}>...</TableCell>
                  <TableCell className={classes.cell}>loading</TableCell>
                  <TableCell className={classes.cell}>...</TableCell>
                </TableRow>
              );
            }

            return (
              <TableRow key={item.id} style={style} hover onDoubleClick={handleRowClick.bind(this, item)}>
                <TableCell className={classes.cell}>{item.id}</TableCell>
                <TableCell className={classes.cell}>{item.name}</TableCell>
                <TableCell className={classes.cell}>{item.email}</TableCell>
              </TableRow>
            );
          }}
        </TableBody>
        <TableFooter component="div" className={classes.footer}>
          <Typography variant="caption">{totalCount} employees</Typography>
        </TableFooter>
      </Table>
    </Widget>
  );
};

export default withStyles(styles)(dataGrid);
