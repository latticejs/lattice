import React, { Component } from 'react';

// Material-UI
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
import { MAIN } from './routes';
import { withSignIn, withCurrentUser } from '../components/Auth';
import { TextField, Button, Form } from '../components/MuiFormik';
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
  }
});

class Login extends Component {
  render() {
    const {
      classes,
      currentUser,
      location: { state },
      isSubmitting,
      status
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
        <Form className={classes.form}>
          <Grid item xs={8}>
            <Typography variant="display1">Sign In</Typography>
          </Grid>
          <Grid item xs={8} className={classes.containerField}>
            <TextField id="email" label="Email" type="text" fullWidth />
            <TextField id="password" label="Password" type="password" fullWidth />
          </Grid>
          <Grid item xs={8}>
            <Button variant="raised" color="primary">
              Sign in
            </Button>
          </Grid>
        </Form>
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
  handleSubmit: async (values, { setSubmitting, setStatus, props: { signIn } }) => {
    try {
      await signIn({
        variables: {
          email: values.email,
          password: values.password
        }
      });

      setSubmitting(false);
    } catch (err) {
      setSubmitting(false);
      setStatus(err);
    }
  },
  displayName: 'BasicForm'
});

export default compose(
  withSignIn,
  withCurrentUser,
  EnhancedForm,
  withStyles(styles)
)(Login);
