import React from 'react';
import { graphql, ApolloConsumer } from 'react-apollo';
import { signIn, currentUser } from '../stores/auth';
import { signOut } from '../config/auth';

export const withCurrentUser = graphql(currentUser, {
  props: ({ data: { currentUser, error, refetch } }) => ({
    currentUser,
    refetchUser: refetch,
    error
  }),
  options: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all'
  }
});

export const withSignOut = Component => (props = {}) => {
  return <ApolloConsumer>{client => <Component {...props} signOut={() => signOut(client)} />}</ApolloConsumer>;
};

export const withSignIn = graphql(signIn, {
  name: 'signIn',
  options: {
    refetchQueries: [{ query: currentUser }]
  }
});
