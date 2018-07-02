import { ApolloLink } from 'apollo-link';

export const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      'x-token': `${localStorage.getItem('token')}`
    }
  }));

  return forward(operation).map(data => {
    if (operation.operationName === 'SignIn') {
      localStorage.setItem('token', data.data.signIn.token);
    }
    return data;
  });
});

export const signOut = client => {
  localStorage.removeItem('token');
  client.resetStore();
};

export const onQLAuthError = (client, message) => {
  if (message === 'NOT_AUTHENTICATED') {
    signOut(client);
  }
};

export const onNetworkAuthError = (client, networkError) => {
  if (networkError.statusCode === 401) {
    signOut(client);
  }
};
