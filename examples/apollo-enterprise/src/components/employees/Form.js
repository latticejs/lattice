import React, { Component } from 'react';
import classnames from 'classnames';

import { withFormik } from 'formik';
import * as yup from 'yup';

// Material-UI
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';

// @latticejs
import { Widget } from '@latticejs/widgets';

// Ours
import { TextField, Button } from '../MuiFormik';
import { GraphqlErrorNotification } from '../Notification';

const styles = theme => ({
  root: {},
  container: {
    padding: '24px 8px'
  }
});

const form = (props) => {
  const { classes, className, status, areas, handleSubmit } = props;

  const handleSuccess = employee => {
    const { handleSuccess } = props;
    handleSuccess(employee);
  };

  const handleCancel = () => {
    const { handleCancel, employee } = props;
    handleCancel(employee);
  };


    return (
      <Widget
        className={classnames(classes.root, className)}
        component="form"
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <GraphqlErrorNotification error={status} />
        <Grid container className={classes.container} spacing={24}>
          <Grid item xs={12}>
            <TextField field="name" label="Name" type="text" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField field="email" label="Email" type="text" fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField field="jobTitle" label="Job" type="text" fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField select loading={areas.loading} field="areaId" label="Area" fullWidth>
              {areas.items.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Toolbar>
            <Grid container spacing={4}>
              <Grid item>
                <Button type="submit" variant="contained" color="primary">
                  Save
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" onClick={handleCancel}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Toolbar>
        </Grid>
      </Widget>
    );
}

export default withStyles(styles)(
  withFormik({
    mapPropsToValues: ({ employee: { id, name = '', email = '', jobTitle = '', areaId = '' } = {} }) => ({
      id,
      name,
      email,
      jobTitle,
      areaId
    }),
    validationSchema: yup.object().shape({
      name: yup.string().required('A name is required'),
      email: yup
        .string()
        .email()
        .required(),
      jobTitle: yup.string().required(),
      areaId: yup.string().required()
    }),
    handleSubmit: async (values, { setSubmitting, setStatus, props }) => {
      const { createEmployee, updateEmployee, handleSuccess } = props;

      try {
        if (values.id) {
          await updateEmployee(values);
        } else {
          await createEmployee(values);
        }

        handleSuccess();
      } catch (err) {
        setSubmitting(false);
        setStatus(err);
      }
    }
  })(form)
);
