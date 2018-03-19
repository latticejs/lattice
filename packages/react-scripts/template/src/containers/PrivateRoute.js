import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Redirect, Route } from 'react-router-dom';

class PrivateRoute extends Component {
  render () {
    const  { loggedIn, component: RouteComponent, render, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={ props => {
          const { location } = props;
          return (loggedIn ? 
            (RouteComponent ? <RouteComponent {...props} /> : render(props)) :
            <Redirect to={{ pathname: "/login", state: { from: location } }}/>)
        }}
      />
    )
  }
}

export default connect(
  ({ user: { loggedIn } }) => ({ loggedIn })
)(PrivateRoute);
