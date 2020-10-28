import React, { FC } from 'react'

import Error from './Error'

const DefaultErrorHandler: FC<{ error: any }> = ({ error }) => {
  if (error?.extensions?.exception?.status === 404) {
    window.location.href = `/404?from=${window.location.pathname}`

    return null
  }

  return <Error error={error} />
}

export default DefaultErrorHandler
