import React, { Component } from 'react';
import { withFormik } from 'formik';
import * as yup from 'yup';

// Material-UI
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

// Apollo
import { compose } from 'react-apollo';

// Router
import { Redirect } from 'react-router-dom';

// Ours
import { MAIN } from './routes';
import { withSignIn } from '../components/Auth';
import { TextField, Button } from '../components/MuiFormik';
import { GraphqlErrorNotification } from '../components/Notification';

const styles = theme => ({
  root: {
    height: '100vh'
  },
  side: {
    overflow: 'hidden',
    display: 'flex'
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
  },
  containerForm: {
    padding: 20
  }
});

class Login extends Component {
  render() {
    const {
      classes,
      location: { state },
      currentUser,
      isSubmitting,
      status,
      handleSubmit
    } = this.props;

    if (!isSubmitting && currentUser) {
      return <Redirect to={state ? state.from : MAIN} />;
    }

    return (
      <Grid container direction="row" alignItems="stretch" spacing={0} className={classes.root}>
        <GraphqlErrorNotification error={status} />
        <Hidden xsDown>
          <Grid item sm={4} className={classes.side}>
            <img src="/images/sidebar-2.jpg" className={classes.img} alt="side" />
          </Grid>
        </Hidden>
        <Grid item xs={12} sm={8} className={classes.containerForm}>
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
              <TextField field="email" label="Email" type="text" fullWidth />
              <TextField field="password" label="Password" type="password" fullWidth />
            </Grid>
            <Grid item xs={8}>
              <Button type="submit" variant="raised" color="primary">
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
  mapPropsToValues: () => ({ email: 'admin@lattice.com', password: '123456' }),
  validationSchema: yup.object().shape({
    email: yup
      .string()
      .email('Invalid email address')
      .required('Email is required!'),
    password: yup.string().required('Password is required!')
  }),
  handleSubmit: async (values, { setSubmitting, setStatus, props: { signIn, refetchUser } }) => {
    try {
      await signIn({
        variables: {
          email: values.email,
          password: values.password
        }
      });

      await refetchUser();
    } catch (err) {
      setSubmitting(false);
      setStatus(err);
    }
  },
  displayName: 'BasicForm'
});

export default compose(
  withSignIn,
  EnhancedForm,
  withStyles(styles)
)(Login);
