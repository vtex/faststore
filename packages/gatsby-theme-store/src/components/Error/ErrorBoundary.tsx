import type { ReactNode } from 'react'
import React, { Suspense, Component, lazy } from 'react'

type Props = {
  children: ReactNode
}

const ErrorHandler = lazy(() => import('./ErrorHandler'))

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
        <Suspense fallback={null}>
          <ErrorHandler error={this.state.error} />
        </Suspense>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
