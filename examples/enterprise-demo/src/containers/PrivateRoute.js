import React, { Component } from 'react';

import { Redirect, Route } from 'react-router-dom';

import { withCurrentUser } from './Auth';

import { SIGN_IN } from './routes';

class PrivateRoute extends Component {
  render() {
    const { currentUser, component: RouteComponent, render, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={props => {
          const { location } = props;
          return currentUser ? (
            RouteComponent ? (
              <RouteComponent {...props} currentUser={currentUser} />
            ) : (
              render(props)
            )
          ) : (
            <Redirect to={{ pathname: SIGN_IN, state: { from: location } }} />
          );
        }}
      />
    );
  }
}

export default withCurrentUser(PrivateRoute);
