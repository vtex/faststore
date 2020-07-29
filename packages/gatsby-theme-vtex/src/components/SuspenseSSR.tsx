import React, { FC, Suspense, SuspenseProps } from 'react'

import { isServer } from '../utils/env'

const SuspenseSSR: FC<SuspenseProps> = ({ fallback, children }) => {
  console.log('SuspenseSSR', { isServer })
  if (isServer) {
    return fallback as any
  }

  return <Suspense fallback={fallback}>{children}</Suspense>
}

export default SuspenseSSR
