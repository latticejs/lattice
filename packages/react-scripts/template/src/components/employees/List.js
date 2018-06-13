import React, { Component } from 'react';

// Material-UI
import Avatar from '@material-ui/core/Avatar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TableFooter from '@material-ui/core/TableFooter';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

// @latticejs
import Widget from '@latticejs/widgets/Widget';

const styles = theme => ({
  root: {
    overflow: 'auto'
  },
  avatarCell: {
    width: 100
  },
  avatar: {
    margin: 10,
    height: 60,
    width: 60
  },
  form: {
    position: 'absolute',
    width: theme.spacing.unit * 75,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`
  },
  cell: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  }
});

const TableHeadField = (props = {}) => {
  const { field, title = '', children, numeric, orderBy, className, onOrder } = props;

  let order;
  let direction;
  if (orderBy && orderBy.field === field) {
    order = orderBy;
    direction = orderBy.direction;
  } else {
    direction = 'asc';
  }

  return (
    <TableCell key={field} numeric={numeric} padding="default" sortDirection={direction} className={className}>
      <Tooltip title={title} placement={numeric ? 'bottom-end' : 'bottom-start'} enterDelay={300}>
        <TableSortLabel
          active={order !== undefined}
          direction={direction}
          onClick={e => {
            let newDirection = 'asc';

            if (order) {
              newDirection = direction === 'asc' ? 'desc' : 'asc';
            }

            onOrder(e, { field, direction: newDirection });
          }}
        >
          {children}
        </TableSortLabel>
      </Tooltip>
    </TableCell>
  );
};

class List extends Component {
  static initialPagination = {
    page: 0,
    rowsPerPage: 5
  };

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
    const { employees = [], meta = {}, page, rowsPerPage, orderBy, classes } = this.props;

    return (
      <Widget className={classes.root}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={2} />
              <TableHeadField field="position" className={classes.cell} onOrder={this.handleOrder} orderBy={orderBy}>
                Positionn
              </TableHeadField>
              <TableHeadField field="department" className={classes.cell} onOrder={this.handleOrder} orderBy={orderBy}>
                Department
              </TableHeadField>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map(employee => {
              return (
                <TableRow key={employee.id} hover onClick={event => this.handleRowClick(event, employee)}>
                  <TableCell className={classes.avatarCell}>
                    <Avatar alt={employee.name} src="/images/default-avatar.png" className={classes.avatar} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{employee.name}</Typography>
                    <Typography variant="caption">{employee.email}</Typography>
                  </TableCell>
                  <TableCell className={classes.cell}>{employee.position}</TableCell>
                  <TableCell className={classes.cell}>{employee.department}</TableCell>
                </TableRow>
              );
            })}
            {!employees.length && (
              <TableRow>
                <TableCell colSpan="3">
                  <Typography variant="caption">No data to show.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={4}
                page={page}
                rowsPerPage={rowsPerPage}
                count={meta.count || 0}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Widget>
    );
  }
}

export default withStyles(styles)(List);
