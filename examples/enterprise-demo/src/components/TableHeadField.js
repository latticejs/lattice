import React from 'react';

import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';

import { TableCell } from '@latticejs/widgets';

export default function TableHeadField(props = {}) {
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
}
