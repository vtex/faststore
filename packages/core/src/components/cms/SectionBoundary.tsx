import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

class SectionBoundary extends Component<{
  children: ReactNode
  name: string
}> {
  public state = { hasError: false, error: null }

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

    return this.props.children
  }
}

export default SectionBoundary
