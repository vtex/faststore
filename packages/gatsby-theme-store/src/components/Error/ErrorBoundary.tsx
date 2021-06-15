import React, { Component } from 'react'

import ErrorHandler from './ErrorHandler'

class ErrorBoundary extends Component {
  public state = { hasError: false, error: null }

  public static getDerivedStateFromError(error: any) {
    return {
      hasError: true,
      error,
    }
  }

  public render() {
    if (this.state.hasError && process.env.NODE_ENV === 'production') {
      return (
        <ErrorHandler error={this.state.error}>
          {this.props.children}
        </ErrorHandler>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
