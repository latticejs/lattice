import React, { Component } from 'react';

// Material-UI
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

// Apollo
import { compose, graphql } from 'react-apollo';

// Router
import { Redirect } from 'react-router-dom';

// Ours
import user, { signIn } from '../queries/user';

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
  }
});

class Login extends Component {
  state = {
    username: 'jane.doe@company.co',
    password: ''
  }


  handleSignIn = () => {
    const { username, password } = this.state;
    const { signIn } = this.props;

    signIn({
      variables: {
        username,
        password
      }
    })
  }

  render () {
    const { classes, loggedIn, location: { state } } = this.props;
    const { username, password } = this.state;
    return (
      loggedIn ? <Redirect to={state ? state.from : '/'} /> :
      <Grid container direction="row" alignItems="stretch" spacing={0} className={classes.root}>
        <Hidden xsDown>
          <Grid item sm={4} className={classes.side}>
            <img src="/images/sidebar-2.jpg" className={classes.img} alt="side" />
          </Grid>
        </Hidden>
        <Grid item xs={12} sm={8}>
          <Grid
            container
            alignContent="center"
            justify="center"
            spacing={40}
            className={classes.form}
          >
            <Grid item xs={8}>
              <Typography variant="display1">Sign In</Typography>
            </Grid>
            <Grid item xs={8} component="form" autoComplete="off">
              <TextField
                label="Username"
                type="text"
                fullWidth
                value={username}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
              />
            </Grid>
            <Grid item xs={8}>
              <Button variant="raised" color="primary" onClick={this.handleSignIn}>
                Sign in
              </Button>
            </Grid>
          </Grid>    
        </Grid>
      </Grid>
    );
  }
}

export default compose(
  graphql(user, {
    props: ({ data: { user: { loggedIn } } }) => ({ loggedIn })    
  }),
  graphql(signIn, { name: 'signIn' }),
  withStyles(styles)
)(Login)
