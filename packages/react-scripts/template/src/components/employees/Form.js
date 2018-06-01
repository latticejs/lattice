import React, { Component } from 'react';
import classnames from 'classnames';

import { withFormik } from 'formik';
import yup from 'yup';

// Material-UI
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';

// @latticejs
import Widget from '@latticejs/widgets/Widget';

const styles = theme => ({
  root: {
  },
  container: {
    padding: '24px 8px'
  }
});

class Form extends Component {
  
  handleFieldChange = (...args) => {
    const { handleChange } = this.props;
    handleChange(...args);
  }

  handleCancel = () => {
    const { onCancel } = this.props; 
    onCancel();
  }

  isAdd = () => {
    return !!(this.props.employee)
  }

  render () {
    const { classes, className, values, errors, touched, departments = [], handleSubmit, isSubmitting } = this.props;
    const action = this.isAdd() ? 'Edit' : 'Add';

    return (
      <Widget
        title={`${action} Employee`}
        className={classnames(classes.root, className)}
        component="form"
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <Grid container className={classes.container} spacing={24}>
          <Grid item xs={12}>
            <TextField
              label={(touched.name && errors.name) || "Name"}
              name="name"
              required
              error={!!errors.name}
              fullWidth
              value={values.name}
              onChange={this.handleFieldChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={(touched.email && errors.email) || "Email"}
              name="email"
              required
              error={!!errors.email}
              fullWidth
              value={values.email}
              onChange={this.handleFieldChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Position"
              name="position"
              fullWidth
              value={values.position}
              onChange={this.handleFieldChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              label="Department"
              name="department"
              fullWidth
              value={values.department}
              onChange={this.handleFieldChange}
            >
              {departments.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Toolbar>
            <Grid container spacing={16}>
              <Grid item>
                <Button type="submit" variant="raised" color="primary" disabled={isSubmitting}>Save</Button>
              </Grid>
              <Grid item>
                <Button variant="raised" onClick={this.handleCancel}>Cancel</Button>
              </Grid>
            </Grid>
          </Toolbar>
        </Grid>
      </Widget>
    );
  }
}

export default withStyles(styles)(
  withFormik({
    mapPropsToValues: ({ employee: { id, name = '', email = '', department = '', position = ''} = {} }) => ({
      id,
      name,
      email,
      department,
      position
    }),
    validationSchema: yup.object().shape({
      name: yup.string().required('A name is required'),
      email: yup.string().email().required(),
      position: yup.string(),
      department: yup.string()
    }),
    handleSubmit: (values, { props }) => {
      const { onCreate, onUpdate } = props;
      let { id } = values;

      if (id) {
        onUpdate(values)
      } else {
        values.id = 2000 + Math.floor(Math.random() * 1000 )
        onCreate(values)
      }
    }
  })(Form));
