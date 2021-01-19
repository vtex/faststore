import React from 'react'
import type { FC } from 'react'

import Error from './Error'

const ErrorHandler: FC<{ error: any }> = ({ error }) => {
  if (
    error?.extensions?.exception?.status === 404 ||
    error.message === 'Not Found'
  ) {
    window.location.href = `/404?from=${window.location.pathname}`

    return null
  }

  return <Error error={error} />
}

export default ErrorHandler
