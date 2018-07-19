import React from 'react';
import Notification from './Notification';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null
    };
  }

  componentDidCatch(error) {
    if (error.graphQLErrors) {
      this.setState({ error: error.graphQLErrors.map(error => error.message).join('\n') });
    }
  }

  render() {
    const { error } = this.state;

    if (error) {
      return <Notification open={true} message={error} variant="error" />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
