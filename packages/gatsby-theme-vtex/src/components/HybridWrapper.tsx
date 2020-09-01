import React, { FC, Suspense, SuspenseProps, useEffect, useState } from 'react'

import { isServer } from '../utils/env'

interface Props extends SuspenseProps {
  isPrerendered: boolean
}

globalThis.__REACT_HYDRATED__ = false

const HybridWrapper: FC<Props> = ({ fallback, isPrerendered, children }) => {
  const [isHydrated, setIsHydrated] = useState(globalThis.__REACT_HYDRATED__)

  useEffect(() => {
    globalThis.__REACT_HYDRATED__ = true

    // we only need to change  this component's state when this
    // page is dynamic. Pre-rendered pages are already ok
    if (!isPrerendered) {
      setIsHydrated(true)
    }
  }, [isPrerendered])

  if (isPrerendered) {
    if (isServer) {
      return <>{children}</>
    }

    return <Suspense fallback={fallback}>{children}</Suspense>
  }

  if (isHydrated) {
    return <Suspense fallback={fallback}>{children}</Suspense>
  }

  return <>{fallback}</>
}

export default HybridWrapper
