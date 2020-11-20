import React, { Component } from 'react';

import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';

import { TableCell } from './Table';

const checkOrder = (field, orderBy) => {
  const order = orderBy.find((o) => o.field === field);

  let direction = 'asc';
  let active = false;
  if (order) {
    active = true;
    direction = order.direction;
  }
  return { active, direction };
};

export default class TableOrderCell extends Component {
  static defaultProps = {
    multiSort: true,
    title: '',
    orderBy: [],
  };

  handleOrder = ({ active, direction }, e) => {
    const { handleOrder, multiSort, field, orderBy } = this.props;
    let newDirection = 'asc';

    if (active) {
      newDirection = direction === 'asc' ? 'desc' : 'asc';
    }

    const nextOrder = { field, direction: newDirection };
    let nextOrderBy;
    if (multiSort && e.shiftKey) {
      nextOrderBy = [...orderBy.filter((o) => o.field !== field), nextOrder];
    } else {
      nextOrderBy = [nextOrder];
    }

    handleOrder(nextOrderBy);
  };

  render() {
    const { field, title, children, numeric, sort, orderBy, className } = this.props;

    const { active, direction } = checkOrder(field, orderBy);

    return (
      <TableCell
        key={`order-${field}`}
        numeric={numeric}
        padding="default"
        sortDirection={sort && direction}
        className={className}
      >
        <Tooltip title={title} placement={numeric ? 'bottom-end' : 'bottom-start'} enterDelay={300}>
          <TableSortLabel
            active={active}
            direction={direction}
            onClick={this.handleOrder.bind(this, { active, direction })}
          >
            {children ? children : title}
          </TableSortLabel>
        </Tooltip>
      </TableCell>
    );
  }
}
