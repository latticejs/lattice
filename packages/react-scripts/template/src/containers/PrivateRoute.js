import React, { Component } from 'react';

import { Redirect, Route } from 'react-router-dom';

// Apollo
import { compose, graphql } from 'react-apollo';
import user from '../queries/user';

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

export default compose(
  graphql(user, {
    props: ({ data: { user: { loggedIn } } }) => ({ loggedIn })
  })
)(PrivateRoute)
