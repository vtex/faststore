/* eslint-disable @typescript-eslint/ban-types */
import React, { Component } from 'react'
import type { ErrorInfo } from 'react'

import ErrorHandler from './ErrorHandler'

class ErrorBoundary extends Component {
  public state = { hasError: false, error: null }

  public static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error,
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`React Error: ${error.message} ${errorInfo.componentStack}`)
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
