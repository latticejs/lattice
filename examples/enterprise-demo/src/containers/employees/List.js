import React, { Component } from 'react';
import { generatePath } from 'react-router';

// Apollo
import { compose, graphql } from 'react-apollo';

// Material-UI
import Grid from '@material-ui/core/Grid';

import AddIcon from '@material-ui/icons/Add';

// Ours
import { offsetToCursor, mergeEdges } from '../../utils';
import { EMPLOYEES_CREATE, EMPLOYEES_EDIT } from '../routes';
import { Link } from '../../components/MuiRouter';
import DataGrid from '../../components/employees/DataGrid';

// stores
import { employeesConnection } from '../../stores/employee';

class List extends Component {
  temp = new Map();

  static defaultProps = {
    employeesConnection: { totalCount: 0, edges: [] }
  };

  handleLoadMore = async ({ startIndex, stopIndex }) => {
    return this.props.fetchMore({ first: stopIndex - startIndex, after: offsetToCursor(startIndex - 1) });
  };

  findItem = ({ index }) => {
    const {
      employeesConnection: { edges }
    } = this.props;

    if (this.temp.has(index)) {
      return this.temp.get(index);
    }

    const findCursor = offsetToCursor(index);

    const edge = edges.find(edge => {
      return edge.cursor === findCursor;
    });

    if (edge) {
      this.temp.set(index, edge.node);
      return edge.node;
    }

    return null;
  };

  handleSearch = e => {
    const { onFilterBy } = this.props;
    const filter = e.target.value;
    onFilterBy(filter);
  };

  handleOrder = order => {
    const { onOrder } = this.props;
    onOrder(order);
  };

  handleSelect = employee => {
    this.props.history.push(
      generatePath({
        to: EMPLOYEES_EDIT,
        params: {
          id: employee.id
        }
      })
    );
  };

  handleAdded = () => {};

  handleUpdated = () => {};

  render() {
    const {
      employeesConnection: { edges, totalCount },
      loading
      //variables: { page, rowsPerPage, filterBy, orderBy }
    } = this.props;

    return (
      <Grid container spacing={16}>
        <Grid item xs={8}>
          <Link color="primary" variant="raised" to={EMPLOYEES_CREATE}>
            <AddIcon /> Add
          </Link>
        </Grid>
        <Grid item xs={12}>
          <DataGrid
            list={edges.map(edge => edge.node)}
            totalCount={totalCount}
            loading={loading}
            handleLoadMore={this.handleLoadMore}
            findItem={this.findItem}
            handleSearch={this.handleSearch}
            handleOrder={this.handleOrder}
            handleSelect={this.handleSelect}
          />
        </Grid>
      </Grid>
    );
  }
}

export default compose(
  graphql(employeesConnection, {
    props: ({ data: { employeesConnection, loading, refetch, fetchMore } }) => ({
      employeesConnection,
      loading,
      fetchMore({ first, after }) {
        return fetchMore({
          variables: { first, after: after || (employeesConnection ? employeesConnection.pageInfo.endCursor : null) },
          // concatenate old and new entries
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const { edges: previousEdges } = previousResult.employeesConnection;
            const { edges: nextEdges, ...props } = fetchMoreResult.employeesConnection;

            return {
              employeesConnection: {
                ...props,
                edges: mergeEdges(previousEdges, nextEdges)
              }
            };
          }
        });
      },
      refetch
    }),
    options: props => ({
      variables: {
        first: 10
      }
    })
  })
)(List);

//export default compose(
//graphql(employees, {
//options(props) {
//return {
//variables: {
//...List.initialPagination,
//filterBy: ''
//}
//};
//},
//props({ data: { allEmployees, _allEmployeesMeta, refetch, fetchMore, variables } }) {
//return {
//variables,
//employees: allEmployees,
//meta: _allEmployeesMeta,
//onPageChange(page, rowsPerPage) {
//return refetch({
//...variables,
//rowsPerPage,
//page
//});
//},
//fetchMore(page, rowsPerPage) {
//return fetchMore({
//rowsPerPage,
//page
//});
//},
//onFilterBy(text) {
//return refetch({
//...variables,
//page: 0,
//filterBy: text
//});
//},
//onOrder(orderBy = []) {
//return refetch({
//...variables,
//orderBy
//});
//}
//};
//}
//}),
//graphql(departments, {
//props({ data: { allDepartments } }) {
//return {
//departments: allDepartments
//};
//}
//}),
//graphql(createEmployee, {
//props({ mutate }) {
//return {
//createEmployee: employee => {
//return mutate({
//variables: {
//...employee
//}
//});
//}
//};
//}
//}),
//graphql(updateEmployee, {
//props({ mutate }) {
//return {
//updateEmployee: employee => {
//return mutate({
//variables: {
//...employee
//}
//});
//}
//};
//}
//})
//)(List);
