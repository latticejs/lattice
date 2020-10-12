import React, { useContext } from 'react';

import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { OrgContext, UserContextProvider, UserGroupContextProvider } from './context';

import OrgLandingPage from './OrgLandingPage';

import UserGroupList from './UserGroupList';
import UserList from './UserList';

const Org = ({ showLoader }) => {
  const { selectedOrg } = useContext(OrgContext);
  const { path } = useRouteMatch();

  if (!selectedOrg) {
    return showLoader(true);
  }

  return (
    <div>
      <Switch>
        <Route exact path={path}>
          <OrgLandingPage showLoader={showLoader} />
        </Route>
        <Route path={`${path}users/`}>
          <UserContextProvider currentOrg={selectedOrg}>
            <UserList showLoader={showLoader} />
          </UserContextProvider>
        </Route>
        <Route path={`${path}groups/`}>
          <UserGroupContextProvider currentOrg={selectedOrg}>
            <UserGroupList showLoader={showLoader} />
          </UserGroupContextProvider>
        </Route>
      </Switch>
    </div>
  );
};

export default Org;
