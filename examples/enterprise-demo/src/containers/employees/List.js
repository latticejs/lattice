import React, { Component } from 'react';
import { generatePath } from 'react-router';

// Apollo
import { compose, graphql } from 'react-apollo';

// Material-UI
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';

// stores
import { employeesConnection } from '../../stores/employee';

// Ours
import { offsetToCursor, mergeEdges } from '../../utils';
import { EMPLOYEES_CREATE, EMPLOYEES_EDIT } from '../routes';
import { Link } from '../../components/MuiRouter';
import DataGrid from '../../components/employees/DataGrid';

class List extends Component {
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

    const findCursor = offsetToCursor(index);

    const edge = edges.find(edge => {
      return edge.cursor === findCursor;
    });

    if (edge) {
      return edge.node;
    }

    return null;
  };

  handleOrder = async orderBy => {
    const { fetchData } = this.props;
    const { list } = this;

    await fetchData({ orderBy });

    list.resetLoadMoreRowsCache(true);
  };

  handleSearch = async filterBy => {
    const { fetchData } = this.props;
    const { list } = this;

    await fetchData({ filterBy });

    list.resetLoadMoreRowsCache(true);
  };

  handleSelect = employee => {
    this.props.history.push(
      generatePath(
        EMPLOYEES_EDIT,

        {
          id: employee.id
        }
      )
    );
  };

  handleAdded = () => {};

  handleUpdated = () => {};

  render() {
    const {
      employeesConnection: { edges, totalCount },
      loading,
      variables: { filterBy, orderBy }
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
            listRef={instance => (this.list = instance)}
            list={edges.map(edge => edge.node)}
            totalCount={totalCount}
            loading={loading}
            filterBy={filterBy}
            orderBy={orderBy}
            handleLoadMore={this.handleLoadMore}
            findItem={this.findItem}
            handleSelect={this.handleSelect}
            handleOrder={this.handleOrder}
            handleSearch={this.handleSearch}
          />
        </Grid>
      </Grid>
    );
  }
}

export default compose(
  graphql(employeesConnection, {
    props: ({ data: { employeesConnection, loading, refetch, fetchMore, variables } }) => {
      return {
        employeesConnection,
        loading,
        variables,
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
        fetchData(props) {
          return refetch({ ...variables, ...props });
        }
      };
    },
    options: props => ({
      variables: {
        first: 10,
        orderBy: [{ field: 'name', direction: 'asc' }]
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
