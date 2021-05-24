import React, { Suspense, useState } from 'react'
import type { FC, SuspenseProps } from 'react'

import { useIdleEffect } from './hooks/useIdleEffect'

const SuspenseSSR: FC<SuspenseProps> = ({ fallback, children }) => {
  const [hydrating, setHydrating] = useState(true)

  const timeout = setTimeout(() => {
    if (hydrating) {
      setHydrating(false)
    }
  }, 5500)

  useIdleEffect(() => {
    if (hydrating) {
      setHydrating(false)
      clearTimeout(timeout)
    }
  }, [])

  if (hydrating) {
    return <>{fallback}</>
  }

  return <Suspense fallback={fallback}>{children}</Suspense>
}

export default SuspenseSSR
