import React, { Component } from 'react';
import { connect } from 'react-redux';

// Material-UI
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Hidden from 'material-ui/Hidden';
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

import { Redirect } from 'react-router-dom';

// Ours
import { signIn } from '../actions/user';

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
  handleSignIn = () => {
    this.props.signIn()
  }

  render () {
    const { classes, loggedIn, location: { state } } = this.props;
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
                value="jane@company.co"
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
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

export default connect(
  ({ user: { loggedIn } }) => ({loggedIn}),
  (dispatch) => ({
    signIn: () => dispatch(signIn())
  })
)(withStyles(styles)(Login));