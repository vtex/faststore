'use client'

import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  name: string
}

interface ErrorBoundaryState {
  hasError: Boolean
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

    return this.props.children
  }
}

export default SectionBoundary
