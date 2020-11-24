import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback: (error: any) => ReactNode
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
      return this.props.fallback(this.state.error)
    }

    return this.props.children
  }
}

export default ErrorBoundary
