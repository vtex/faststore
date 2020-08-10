import React, { FC, Suspense, SuspenseProps } from 'react'

import { isServer } from '../utils/env'

interface Props extends SuspenseProps {
  isPrerendered: boolean
}

const HybridWrapper: FC<Props> = ({ fallback, isPrerendered, children }) => {
  if (isPrerendered) {
    return <>{children}</>
  }

  if (isServer) {
    return fallback as any
  }

  return <Suspense fallback={fallback}>{children}</Suspense>
}

export default HybridWrapper
