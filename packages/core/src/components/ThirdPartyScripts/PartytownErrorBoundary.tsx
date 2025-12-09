import React, { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class PartytownErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Only log in development to avoid noise in production
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'Partytown encountered an error. This is expected in cross-origin iframe contexts and can be safely ignored.',
        error,
        errorInfo
      )
    }
  }

  render() {
    if (this.state.hasError) {
      // Silently fail - Partytown features won't work but the app continues
      return null
    }

    return this.props.children
  }
}

export default PartytownErrorBoundary
