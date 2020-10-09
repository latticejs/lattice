import { Route } from 'react-router-dom';
import { useAuth0 } from './react-auth0-spa';
import React, { useEffect } from 'react';

function PrivateRoute({ path, children, ...rest }) {
  const { loading, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (loading || isAuthenticated) {
      return;
    }
    const fn = async () => {
      await loginWithRedirect({
        appState: { targetUrl: path },
      });
    };
    fn();
  }, [loading, isAuthenticated, loginWithRedirect, path]);

  if (!isAuthenticated) {
    return <React.Fragment key="key" />;
  }
  return <Route {...rest} render={({ location }) => children} />;
}

export default PrivateRoute;
