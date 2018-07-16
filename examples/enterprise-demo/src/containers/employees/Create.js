import React, { Component } from 'react';
import { generatePath } from 'react-router';

// Apollo
import { compose, graphql } from 'react-apollo';

// Material-UI
import Grid from '@material-ui/core/Grid';

// Stores
import { getAllAreas } from '../../stores/area';
import { createEmployee } from '../../stores/employee';

// Ours
import { EMPLOYEES } from '../routes';
import Form from '../../components/employees/Form';

class Create extends Component {
  handleSuccess = () => {
    this.props.history.push(generatePath(EMPLOYEES));
  };

  handleCancel = () => {
    this.props.history.push(generatePath(EMPLOYEES));
  };

  render() {
    const { areas, createEmployee } = this.props;

    return (
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Form
            areas={areas}
            saveObject={createEmployee}
            handleCancel={this.handleCancel}
            handleSuccess={this.handleSuccess}
          />
        </Grid>
      </Grid>
    );
  }
}

export default compose(
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
    name: 'createEmployee'
  })
)(Create);
