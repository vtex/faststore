import React from 'react'
import type { FC } from 'react'

import ErrorView from './ErrorView'

const ErrorHandler: FC<{ error: any }> = ({ error }) => {
  if (error?.extensions?.exception?.status === 404) {
    window.location.href = `/404?from=${window.location.pathname}`

    return null
  }

  return <ErrorView error={error} />
}

export default ErrorHandler
