import React, { FC, SuspenseProps, Suspense } from 'react'

import { isServer } from '../utils/env'

interface Props extends SuspenseProps {
  isPrerendered: boolean
}

const HybridWrapper: FC<Props> = ({ fallback, isPrerendered, children }) => {
  if (isServer) {
    if (isPrerendered) {
      return <>{children}</>
    }

    return <>{fallback}</>
  }

  return <Suspense fallback={fallback}>{children}</Suspense>
}

export default HybridWrapper
