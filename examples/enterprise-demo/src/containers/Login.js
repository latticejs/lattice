import React, { Component } from 'react';

// Material-UI
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { withFormik } from 'formik';
import * as yup from 'yup';

// Apollo
import { compose } from 'react-apollo';

// Router
import { Redirect } from 'react-router-dom';

// Ours
import { withSignIn } from '../components/Auth';
import FormikTextField from '../components/FormikTextField';

const styles = theme => ({
  root: {
    height: '100vh'
  },
  side: {
    overflow: 'hidden'
  },
  img: {
    objectFit: 'cover'
  },
  form: {
    height: '100vh'
  },
  containerField: {
    display: 'flex',
    flexWrap: 'wrap',
    minHeight: 190
  }
});

class Login extends Component {
  render() {
    const {
      classes,
      currentUser,
      location: { state },
      handleSubmit,
      submitForm
    } = this.props;

    if (currentUser) {
      return <Redirect to={state ? state.from : '/'} />;
    }

    return (
      <Grid container direction="row" alignItems="stretch" spacing={0} className={classes.root}>
        <Hidden xsDown>
          <Grid item sm={4} className={classes.side}>
            <img src="/images/sidebar-2.jpg" className={classes.img} alt="side" />
          </Grid>
        </Hidden>
        <Grid item xs={12} sm={8}>
          <Grid
            component="form"
            autoComplete="off"
            onSubmit={handleSubmit}
            container
            alignContent="center"
            justify="center"
            spacing={40}
            className={classes.form}
          >
            <Grid item xs={8}>
              <Typography variant="display1">Sign In</Typography>
            </Grid>
            <Grid item xs={8} className={classes.containerField}>
              <FormikTextField id="email" label="Email" type="text" fullWidth />
              <FormikTextField id="password" label="Password" type="password" fullWidth />
            </Grid>
            <Grid item xs={8}>
              <Button variant="raised" color="primary" onClick={submitForm}>
                Sign in
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

const EnhancedForm = withFormik({
  mapPropsToValues: () => ({ email: '', password: '' }),
  validationSchema: yup.object().shape({
    email: yup
      .string()
      .email('Invalid email address')
      .required('Email is required!'),
    password: yup.string().required('Password is required!')
  }),
  handleSubmit: async (values, { setSubmitting, props: { signIn, refetchUser } }) => {
    try {
      await signIn({
        variables: {
          email: values.email,
          password: values.password
        }
      });

      refetchUser();
    } catch (err) {
      setSubmitting(false);
    }
  },
  displayName: 'BasicForm'
});

export default compose(
  withSignIn,
  EnhancedForm,
  withStyles(styles)
)(Login);
