import React from 'react';
import { Widget } from '@latticejs/widgets';
import { observer, inject } from 'mobx-react';
import { withStyles, FormControl, FormGroup, FormControlLabel, Switch, Button, Grid } from '@material-ui/core';
import { compose } from 'recompose';
import { withFormik } from 'formik';
import { string, object } from 'yup';
import faker from 'faker';

import TextInput from '../Form/TextInput';

const formikEnhancer = withFormik({
  validationSchema: object().shape({
    name: string().required('Name is required.'),
    author: string().required('Author is required.')
  }),

  mapPropsToValues: ({ project: { id = '', name = '', author = '', active = false } }) => ({
    id,
    name,
    author,
    active
  }),

  handleSubmit: (payload, { props: { projectStore, onSave }, setSubmitting }) => {
    const { id, ...data } = payload;

    if (id) {
      projectStore.update(id, data);
    } else {
      projectStore.add({ id: faker.random.uuid(), ...data });
    }

    setSubmitting(false);
    onSave();
  },

  enableReinitialize: true,

  displayName: 'ProjectForm'
});

const enhanceForm = compose(inject('projectStore'), formikEnhancer, observer);

const Form = enhanceForm(props => {
  const { values, errors, touched, handleChange, handleSubmit, isSubmitting, classes, isCreating, onCancel } = props;
  return (
    <form onSubmit={handleSubmit} noValidate autoComplete="off" className={classes.containerForm}>
      <TextInput
        id="name"
        label="Name"
        placeholder="Name"
        className={classes.textField}
        value={values.name}
        onChange={handleChange}
        fullWidth
        error={touched['name'] && errors.name}
      />
      <TextInput
        id="author"
        label="Author"
        placeholder="Author"
        className={classes.textField}
        value={values.author}
        onChange={handleChange}
        fullWidth
        error={touched['author'] && errors.author}
      />
      <FormControl component="fieldset">
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                id="active"
                checked={values.active}
                onChange={handleChange}
                value={values.active ? 'Active' : 'No active'}
              />
            }
            label="Active"
          />
        </FormGroup>
      </FormControl>

      <Grid container justify="flex-end">
        <Grid item>
          <Button variant="contained" className={classes.button} onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} variant="contained" color="primary" className={classes.button}>
            {isCreating ? 'Save' : 'Update'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
});

const ProjectForm = props => {
  const { classes, uiStore, onCancel, onSave } = props;
  const { isCreating, project } = uiStore.projectForm;

  return (
    <Widget
      title={isCreating ? 'New project' : 'Edit project'}
      border="bottom"
      classes={{ root: classes.containerRoot }}
    >
      <Form project={project} classes={classes} onCancel={onCancel} isCreating={isCreating} onSave={onSave} />
    </Widget>
  );
};

const styles = theme => ({
  containerRoot: {
    flex: 1,
    height: '100%'
  },
  containerForm: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    flex: 1
  },
  button: {
    margin: theme.spacing(1),
    flex: 0
  },
  textField: {
    marginBottom: theme.spacing(3)
  }
});

export default compose(withStyles(styles), inject('projectStore', 'uiStore'), observer)(ProjectForm);
