import React, { FC, Suspense, SuspenseProps, useEffect } from 'react'

import { isServer } from '../utils/env'

interface Props extends SuspenseProps {
  isPrerendered: boolean
}

let hydrated = false

const HybridWrapper: FC<Props> = ({ fallback, isPrerendered, children }) => {
  useEffect(() => {
    hydrated = true
  })

  if (isServer || !hydrated) {
    if (isPrerendered) {
      return <>{children}</>
    }

    return <>{fallback}</>
  }

  return <Suspense fallback={fallback}>{children}</Suspense>
}

export default HybridWrapper
