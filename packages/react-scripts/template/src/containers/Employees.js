import React, { Component } from 'react';

// Apollo
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';

// Material-UI
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField/TextField';

import AddIcon from 'material-ui-icons/Add';

// Ours
import List from '../components/employees/List';
import Form from '../components/employees/Form';
import employees, { updateEmployee, createEmployee } from '../queries/employees'

class Employees extends Component {
  state = {
    employee: undefined,
    editing: false
  }

  handlePageChange = (...args) => {
    const { onPageChange } = this.props;
    onPageChange(...args)
  }
 
  handleSearchChange = (e) => {
    const { onFilterBy } = this.props;
    const filter = e.target.value;
    onFilterBy(filter)
  }

  handleSelectionChange = (employee) => {
    this.setState({
      employee,
      editing: true
    })
  }

  onAddEmployee = () => {
    this.setState({
      employee: undefined,
      editing: true
    })
  }

  handleCancel = () => {
    this.setState({
      employee: undefined,
      editing: false
    });
  }

  handleCreateEmployee = (employee) => {
    const { createEmployee } = this.props;
    createEmployee(employee)
    
    this.setState({
      employee: undefined,
      editing: false
    });
  }

  handleUpdateEmployee = (employee) => {
    const { updateEmployee } = this.props;
    updateEmployee(employee)
    
    this.setState({
      employee: undefined,
      editing: false
    });
  }  

  render () {
    const { editing, employee } = this.state;
    const { employees, meta, departments, variables: { page, rowsPerPage, filterBy } } = this.props;

    return (
      <Grid container>
        {
          editing ?
          <Grid item xs={12}>
            <Form
              employee={employee}
              onUpdate={this.handleUpdateEmployee}
              onCreate={this.handleCreateEmployee}
              onCancel={this.handleCancel}
              departments={departments}
            />
          </Grid>
          :
          <React.Fragment>
            <Grid item xs={8}>
             <Button color="primary" variant="raised" onClick={this.onAddEmployee}>
              <AddIcon/> Add
            </Button>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Search"
                type="search"
                fullWidth
                value={filterBy}
                onChange={this.handleSearchChange}
              />
            </Grid>
            <Grid item xs={12}>
              <List
                employees={employees}
                meta={meta}
                onPageChange={this.handlePageChange}
                onSelected={this.handleSelectionChange}
                page={page}
                rowsPerPage={rowsPerPage}
              />
            </Grid>
          </React.Fragment>
        }
      </Grid> 
    )
  }
}

export default compose(
  graphql(employees,
    {
      options (props) {
        return {
          variables: {
            ...List.initialPagination,
            filterBy: ''
          }
        }
      },
      props ({ data: { allEmployees, _allEmployeesMeta, refetch, variables } }) {
        return {
          variables,
          employees: allEmployees,
          meta: _allEmployeesMeta,
          onPageChange (page, rowsPerPage) {
            return refetch({
              ...variables,
              rowsPerPage,
              page
            })
          },
          onFilterBy (text) {
            return refetch({
              ...variables,
              page: 0,
              filterBy: text
            })
          }
        } 
      }
    }
  ),
  graphql(
    gql`
      query AllDepartments {
        allDepartments {
          label value
        }
      }
    `,
    {
      props ({ data: { allDepartments } }) {
        return {
          departments: allDepartments
        }
      }
    }
  ),
  graphql(createEmployee,
    {
      props ({ mutate }) {
        return {
          createEmployee: (employee) => {
            return mutate({
              variables:{
                ...employee
              }
            })
          }
        }
      }      
    }
  ),
  graphql(updateEmployee,
    {
      props ({ mutate }) {
        return {
          updateEmployee: (employee) => {
            return mutate({
              variables:{
                ...employee
              }
            })
          }
        }
      }      
    }
  )
)(Employees);
