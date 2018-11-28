import { Component } from 'react';
import * as Sentry from '@sentry/browser';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error });
    Sentry.configureScope((scope) => {
      Object.keys(errorInfo).forEach((key) => {
        scope.setExtra(key, errorInfo[key]);
      });
    });
    Sentry.captureException(error);
  }

  render() {
    const { error } = this.state;
    // const children = this.props;
    if (error) {
      // render error reporting UI
      return Sentry.showReportDialog();
    }
    // when there's not an error, render children untouched
    // eslint-disable-next-line
    return this.props.children;
  }
}

export default ErrorBoundary;
