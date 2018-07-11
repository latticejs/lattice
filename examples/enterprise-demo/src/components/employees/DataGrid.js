import React, { Component } from 'react';

// Material-UI
import Avatar from '@material-ui/core/Avatar';
import TableFooter from '@material-ui/core/TableFooter';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
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
  }
});

class DataGrid extends Component {
  handleRowClick = (e, employee) => {
    const { onSelected } = this.props;

    onSelected(employee);
  };

  handleChangePage = (e, page) => {
    const { rowsPerPage, onPageChange } = this.props;
    onPageChange(page, rowsPerPage);
  };

  handleChangeRowsPerPage = event => {
    const rowsPerPage = event.target.value;
    const { page, onPageChange } = this.props;
    onPageChange(page, rowsPerPage);
  };

  handleOrder = (event, order) => {
    const { onOrder } = this.props;
    onOrder(order);
  };

  render() {
    const { totalCount, list, classes, handleLoadMore, handleSelect, findItem } = this.props;

    return (
      <Widget className={classes.root}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            loadMore={handleLoadMore}
            findItem={findItem}
            list={list}
            rowCount={totalCount}
            rowHeight={48}
            height={500}
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
                <TableRow key={item.id} style={style} hover onClick={() => handleSelect(item)}>
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
