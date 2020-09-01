import React, { FC, Suspense, SuspenseProps, useEffect, useState } from 'react'

import { isServer } from '../utils/env'

interface Props extends SuspenseProps {
  isPrerendered: boolean
}

;(window as any).__REACT_HYDRATED__ = false

const HybridWrapper: FC<Props> = ({ fallback, isPrerendered, children }) => {
  const [isHydrated, setIsHydrated] = useState(
    (window as any).__REACT_HYDRATED__
  )

  useEffect(() => {
    ;(window as any).__REACT_HYDRATED__ = true
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
