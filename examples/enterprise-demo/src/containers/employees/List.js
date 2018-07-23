import React, { Component } from 'react';
import { generatePath } from 'react-router';

// Apollo
import { compose, graphql } from 'react-apollo';

// Material-UI
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';

// stores
import { employeesConnection } from '../../stores/employee';
import { updateDatagrid, getDatagrid } from '../../stores/ui';

// Ours
import { offsetToCursor, mergeEdges } from '../../utils';
import { EMPLOYEES_CREATE, EMPLOYEES_EDIT } from '../routes';
import DataGrid from '../../components/employees/DataGrid';

class List extends Component {
  static defaultProps = {
    employeesConnection: { totalCount: 0, edges: [] }
  };

  async componentDidMount() {
    const { datagridInfo } = this.props;
    window.requestAnimationFrame(() => {
      if (datagridInfo) {
        this.scroll.scrollTop(datagridInfo.scrollTop);
      }
    });
  }

  handleLoadMore = async ({ startIndex, stopIndex }) => {
    const { fetchMore } = this.props;
    await fetchMore({ first: stopIndex - startIndex, after: offsetToCursor(startIndex - 1) });
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
    return this.handleFetchData({ orderBy });
  };

  handleSearch = async filterBy => {
    return this.handleFetchData({ filterBy });
  };

  handleFetchData = async data => {
    const { fetchData } = this.props;
    const { dataLoader } = this;

    await fetchData(data);

    await this.updateDatagridInfo();

    dataLoader.resetLoadMoreRowsCache(true);
  };

  handleSelect = employee => {
    const { history } = this.props;

    history.push(
      generatePath(EMPLOYEES_EDIT, {
        id: employee.id
      })
    );
  };

  handleAdd = () => {
    const { history } = this.props;

    history.push(generatePath(EMPLOYEES_CREATE));
  };

  handleScrollStop = async (...args) => {
    return this.updateDatagridInfo();
  };

  updateDatagridInfo = async () => {
    const { updateDatagrid, variables } = this.props;

    return updateDatagrid({
      id: 'employees',
      variables,
      scrollTop: this.scroll && this.scroll.getScrollTop()
    });
  };

  render() {
    const {
      employeesConnection: { edges, totalCount },
      loading,
      variables: { filterBy, orderBy }
    } = this.props;

    return (
      <Grid container spacing={16}>
        <Grid item xs={8}>
          <Button color="primary" variant="raised" onClick={this.handleAdd}>
            <AddIcon /> Add
          </Button>
        </Grid>
        <Grid item xs={12}>
          <DataGrid
            dataLoaderRef={instance => (this.dataLoader = instance)}
            scrollRef={instance => (this.scroll = instance)}
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
            handleScrollStop={this.handleScrollStop}
          />
        </Grid>
      </Grid>
    );
  }
}

export default compose(
  graphql(updateDatagrid, {
    props: ({ mutate }) => ({
      updateDatagrid: variables => mutate({ variables })
    })
  }),
  graphql(getDatagrid, {
    props: ({ data: { getDatagrid = {} } }) => ({
      datagridInfo: getDatagrid.variables ? getDatagrid : null
    }),
    options: {
      variables: {
        id: 'employees'
      }
    }
  }),
  graphql(employeesConnection, {
    props: ({ data: { employeesConnection, loading, refetch, fetchMore, variables } }) => {
      return {
        employeesConnection,
        loading,
        variables,
        fetchMore(variables) {
          return fetchMore({
            variables,
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
    options: ({ datagridInfo }) => {
      return {
        variables: datagridInfo
          ? datagridInfo.variables
          : {
              first: 10,
              orderBy: [{ field: 'name', direction: 'asc' }]
            },
        fetchPolicy: 'network'
      };
    }
  })
)(List);
