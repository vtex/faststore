import type { ReactNode } from 'react'
import React, { Component } from 'react'

import ErrorHandler from './ErrorHandler'

type Props = {
  children: ReactNode
}

class ErrorBoundary extends Component<Props> {
  public state = { hasError: false, error: null }

  public static getDerivedStateFromError(error: any) {
    return {
      hasError: true,
      error,
    }
  }

  public render() {
    if (this.state.hasError) {
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
