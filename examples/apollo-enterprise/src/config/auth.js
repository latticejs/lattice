import { ApolloLink } from 'apollo-link';

export const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token');

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }));

  return forward(operation).map(data => {
    if (operation.operationName === 'SignIn' && !data.errors) {
      localStorage.setItem('token', data.data.signIn.token);
    }
    return data;
  });
});

let lock = false;

export const signOut = client => {
  lock = true;
  localStorage.removeItem('token');
  client.resetStore().then(() => {
    lock = false;
  });
};

export const onQLAuthError = (client, message) => {
  if (!lock && message === 'Not Authorised!') {
    localStorage.removeItem('token');
  }

  if (window.location.pathname !== '/login') {
    window.location.href = window.location.origin + '/login';
  }
  // signOut(client);
};

export const onNetworkAuthError = (client, networkError) => {
  if (networkError.statusCode === 401) {
    signOut(client);
  }
};
