import React, { FC, Suspense, SuspenseProps, useEffect, useState } from 'react'

import { isServer } from '../utils/env'

interface Props extends SuspenseProps {
  isPrerendered: boolean
}

let hydrated = false

const HybridWrapper: FC<Props> = ({ fallback, isPrerendered, children }) => {
  const [isHydrated, setIsHydrated] = useState(hydrated)

  useEffect(() => {
    hydrated = true
    setIsHydrated(true)
  }, [])

  if (isServer || !isHydrated) {
    if (isPrerendered) {
      return <>{children}</>
    }

    return <>{fallback}</>
  }

  return <Suspense fallback={fallback}>{children}</Suspense>
}

export default HybridWrapper
