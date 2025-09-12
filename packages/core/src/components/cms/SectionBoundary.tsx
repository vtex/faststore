import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  name: string
  componentKey?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class SectionBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error,
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      `Error while rendering section ${this.props.name} with:\n${error.message} ${errorInfo.componentStack}`
    )

    // TODO: Add fetch in here so we can know which sections are failing on our dashboard
  }

  public render() {
    if (this.state.hasError && process.env.NODE_ENV === 'production') {
      return null
    }

    // Add data attributes for CMS Visual Editor if componentKey is provided
    if (this.props.componentKey) {
      return (
        <div
          data-section-name={this.props.name}
          data-component-key={this.props.componentKey}
        >
          {this.props.children}
        </div>
      )
    }

    return this.props.children
  }
}

export default SectionBoundary
