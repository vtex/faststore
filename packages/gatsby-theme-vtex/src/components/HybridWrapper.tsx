import React, { FC, Suspense, SuspenseProps, useEffect, useState } from 'react'

import { isServer } from '../utils/env'

interface Props extends SuspenseProps {
  isPrerendered: boolean
}

;(globalThis as any).__REACT_HYDRATED__ = false

const HybridWrapper: FC<Props> = ({ fallback, isPrerendered, children }) => {
  const [isHydrated, setIsHydrated] = useState(
    (globalThis as any).__REACT_HYDRATED__
  )

  useEffect(() => {
    ;(globalThis as any).__REACT_HYDRATED__ = true
    setIsHydrated(true)
  }, [])

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
