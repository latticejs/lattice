import React, { Component } from 'react';
import debounce from 'lodash.debounce';

import { TableCell } from '@latticejs/widgets';

export default class TableSearchCell extends Component {
  static defaultProps = {
    debounce: 300,
    filterBy: []
  };

  constructor(props) {
    super(props);

    const { field, filterBy } = props;

    const filter = filterBy.find(filter => filter.field === field);

    this.state = {
      value: filter ? filter.value : ''
    };

    this.search = debounce(this.search, props.debounce);
  }

  handleInputChange = e => {
    const target = e.target;
    const value = target.value;
    this.updateValue(value);
  };

  updateValue = value => {
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
    const { field, children, className } = this.props;

    return (
      <TableCell key={`search-${field}`} padding="default" className={className}>
        {children({
          inputProps: {
            name: field,
            value: this.state.value,
            onChange: this.handleInputChange
          },
          updateValue: this.updateValue
        })}
      </TableCell>
    );
  }
}
