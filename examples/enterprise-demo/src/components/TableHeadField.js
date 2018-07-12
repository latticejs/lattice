import React, { Component } from 'react';

import debounce from 'lodash.debounce';
import Tooltip from '@material-ui/core/Tooltip';

import { TableCell } from '@latticejs/widgets';

const checkOrder = (field, orderBy) => {
  const order = orderBy.find(o => o.field === field);

  let direction = 'asc';
  let active = false;
  if (order) {
    active = true;
    direction = order.direction;
  }
  return { active, direction };
};

export default class TableHeadField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ''
    };

    this.search = debounce(this.search, props.debounce);
  }

  static defaultProps = {
    multiSort: true,
    debounce: 500,
    title: '',
    orderBy: [],
    filterBy: []
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
      nextOrderBy = [...orderBy.filter(o => o.field !== field), nextOrder];
    } else {
      nextOrderBy = [nextOrder];
    }

    handleOrder(nextOrderBy);
  };

  handleInputChange = e => {
    const target = e.target;
    const value = target.value;

    this.setState(
      {
        value
      },
      () => {
        this.search();
      }
    );
  };

  search = () => {
    const { field, filterBy, handleSearch } = this.props;
    const { value } = this.state;

    const filter = { field, value };
    const filters = filterBy.filter(filter => filter.field !== field);
    handleSearch([...filters, filter]);
  };

  render() {
    const { field, title, children, numeric, sort, orderBy, className } = this.props;

    const { active, direction } = checkOrder(field, orderBy);

    return (
      <TableCell
        key={field}
        numeric={numeric}
        padding="default"
        sortDirection={sort && direction}
        className={className}
      >
        <Tooltip title={title} placement={numeric ? 'bottom-end' : 'bottom-start'} enterDelay={300}>
          {children({
            title,
            orderProps: {
              active,
              direction,
              onClick: this.handleOrder.bind(this, { active, direction })
            },
            searchProps: {
              name: field,
              value: this.state.value,
              onChange: this.handleInputChange
            }
          })}
        </Tooltip>
      </TableCell>
    );
  }
}
