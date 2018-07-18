import React, { Component } from 'react';
import { generatePath } from 'react-router';

// Apollo
import { compose, graphql } from 'react-apollo';

// Material-UI
import Grid from '@material-ui/core/Grid';

// Stores
import { getAllAreas } from '../../stores/area';
import { getEmployee, createEmployee, updateEmployee } from '../../stores/employee';

// Ours
import { EMPLOYEES } from '../routes';
import Loader from '../../components/Loader';
import EmployeesForm from '../../components/employees/Form';

class Form extends Component {
  handleSuccess = () => {
    const { history } = this.props;
    const { location } = history;
    this.props.history.push(generatePath(EMPLOYEES), location.state);
  };

  handleCancel = () => {
    const { history } = this.props;
    const { location } = history;
    this.props.history.push(generatePath(EMPLOYEES), location.state);
  };

  render() {
    const { areas, createEmployee, updateEmployee, employee, loading } = this.props;

    return (
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Loader loading={loading} component="circular">
            <EmployeesForm
              employee={employee}
              areas={areas}
              createEmployee={createEmployee}
              updateEmployee={updateEmployee}
              handleCancel={this.handleCancel}
              handleSuccess={this.handleSuccess}
            />
          </Loader>
        </Grid>
      </Grid>
    );
  }
}

export default compose(
  graphql(getEmployee, {
    skip: ({ match }) => !match.params.id,
    options: ({ match }) => ({
      variables: {
        id: match.params.id
      }
    }),
    props: ({ data: { getEmployee, loading, error } }) => {
      return {
        employee: getEmployee && {
          ...getEmployee,
          areaId: getEmployee.area.id
        },
        loading
      };
    }
  }),
  graphql(getAllAreas, {
    props: ({ data: { getAllAreas = [], loading, error } }) => {
      return {
        areas: {
          items: getAllAreas,
          loading,
          error
        }
      };
    }
  }),
  graphql(createEmployee, {
    props({ mutate }) {
      return {
        createEmployee: employee => {
          return mutate({
            variables: employee
          });
        }
      };
    }
  }),
  graphql(updateEmployee, {
    props({ mutate }) {
      return {
        updateEmployee: employee => {
          return mutate({
            variables: employee
          });
        }
      };
    }
  })
)(Form);
