import React from 'react';
import { graphql, compose, ApolloConsumer } from 'react-apollo';
import { signIn } from '../stores/auth';
import { signOut } from '../config/auth';
import { currentUser } from '../stores/user';

export const withCurrentUser = graphql(currentUser, {
  props: ({ data: { currentUser, refetch } }) => ({
    currentUser,
    refetchUser: refetch
  })
});

export const withSignOut = Component => (props = {}) => {
  return <ApolloConsumer>{client => <Component {...props} signOut={() => signOut(client)} />}</ApolloConsumer>;
};

export const withSignIn = compose(
  withCurrentUser,
  graphql(signIn, {
    props: ({ mutate, ownProps: { refetchUser }, client }) => ({
      signIn: (...args) => mutate(...args).then(refetchUser)
    })
  })
);
