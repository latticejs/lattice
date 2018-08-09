import React from 'react';
import { graphql, ApolloConsumer } from 'react-apollo';
import { signIn, currentUser } from '../stores/auth';
import { signOut } from '../config/auth';

export const withCurrentUser = graphql(currentUser, {
  props: ({ data: { currentUser, error, refetch, loading } }) => ({
    currentUser,
    refetchUser: refetch,
    loadingUser: loading,
    errorUser: error
  }),
  options: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  }
});

export const withSignOut = Component => (props = {}) => {
  return <ApolloConsumer>{client => <Component {...props} signOut={() => signOut(client)} />}</ApolloConsumer>;
};

export const withSignIn = graphql(signIn, {
  name: 'signIn'
});
