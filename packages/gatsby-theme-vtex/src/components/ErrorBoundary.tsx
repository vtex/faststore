import { Component, SuspenseProps } from 'react'

class ErrorBoundary extends Component<SuspenseProps> {
  public state = { hasError: false, error: null }

  public static getDerivedStateFromError(error: any) {
    return {
      hasError: true,
      error,
    }
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

export default ErrorBoundary
