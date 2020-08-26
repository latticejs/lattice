import React, { Component } from 'react';

// Apollo
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';

// Material-UI
import Grid from '@material-ui/core/Grid';

// @latticejs
import { Loader } from '@latticejs/widgets';

// Stores
import { getAllAreas } from '../../stores/area';
import { getEmployee, createEmployee, updateEmployee } from '../../stores/employee';

// Ours
import EmployeesForm from '../../components/employees/Form';

const form = (props) => {
  const { areas, createEmployee, updateEmployee, employee, loading } = props;

  const handleSuccess = () => {
    props.history.goBack();
  };

  const handleCancel = () => {
    props.history.goBack();
  };


    return (
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Loader loading={loading} component="circular">
            <EmployeesForm
              employee={employee}
              areas={areas}
              createEmployee={createEmployee}
              updateEmployee={updateEmployee}
              handleCancel={handleCancel}
              handleSuccess={handleSuccess}
            />
          </Loader>
        </Grid>
      </Grid>
    );
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
)(form);
