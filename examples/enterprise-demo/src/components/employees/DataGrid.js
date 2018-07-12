import React, { Component } from 'react';

// Material-UI
import TableFooter from '@material-ui/core/TableFooter';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { withStyles } from '@material-ui/core/styles';

// @latticejs
import { Widget, Table, TableBody, TableHead, TableRow, TableCell } from '@latticejs/widgets';

// Ours
import TableHeadField from '../TableHeadField';

const styles = theme => ({
  root: {
    overflowX: 'auto'
  },
  avatarCell: {
    width: 100
  },
  avatar: {
    margin: 10,
    height: 60,
    width: 60
  },
  cell: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  footer: {
    padding: 10,
    textAlign: 'right'
  },
  input: {
    margin: theme.spacing.unit
  }
});

class DataGrid extends Component {
  handleRowClick = employee => {
    const { handleSelect } = this.props;

    handleSelect(employee);
  };

  render() {
    const {
      listRef,
      totalCount,
      list,
      classes,
      filterBy,
      orderBy,
      handleLoadMore,
      handleSelect,
      findItem,
      handleOrder,
      handleSearch
    } = this.props;

    return (
      <Widget className={classes.root}>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadField
                field="id"
                title="ID"
                className={classes.cell}
                handleOrder={handleOrder}
                orderBy={orderBy}
              >
                {({ title, orderProps }) => {
                  return <TableSortLabel {...orderProps}>{title}</TableSortLabel>;
                }}
              </TableHeadField>
              <TableHeadField
                field="name"
                title="Name"
                className={classes.cell}
                orderBy={orderBy}
                handleOrder={handleOrder}
                filterBy={filterBy}
                handleSearch={handleSearch}
              >
                {({ title, orderProps, searchProps }) => {
                  return (
                    <div>
                      <TableSortLabel {...orderProps}>{title}</TableSortLabel>
                      <Input className={classes.input} {...searchProps} />
                    </div>
                  );
                }}
              </TableHeadField>
              <TableHeadField
                field="email"
                title="Email"
                className={classes.cell}
                handleOrder={handleOrder}
                orderBy={orderBy}
              >
                {({ title, orderProps }) => {
                  return <TableSortLabel {...orderProps}>{title}</TableSortLabel>;
                }}
              </TableHeadField>
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
              ref: listRef
            }}
          >
            {({ item, isEmpty, key, style }) => {
              if (isEmpty) {
                return (
                  <Grid container spacing={16} alignItems="center" justify="center">
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
                <TableRow key={item.id} style={style} hover onClick={this.handleRowClick.bind(this, item)}>
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
  }
}

export default withStyles(styles)(DataGrid);
