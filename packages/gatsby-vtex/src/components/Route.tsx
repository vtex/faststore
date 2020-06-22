import React, { FC, Suspense } from 'react'

import { isServer } from '../utils/env'

interface Props {
  path: string
  render: JSX.Element
  fallback: JSX.Element
}

// Since we use @loadable/component. It's always safe to return
// render right away on the Server. On client we'd better use
// Suspense for partial hydration
const Route: FC<Props> = ({ fallback, render }) => {
  if (isServer) {
    return render
  }

  return <Suspense fallback={fallback}>{render}</Suspense>
}

export default Route
