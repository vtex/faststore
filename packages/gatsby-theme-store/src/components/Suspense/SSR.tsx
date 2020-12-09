import React, { Suspense, useState } from 'react'
import type { FC, SuspenseProps } from 'react'

import { useIdleEffect } from '../../sdk/useIdleEffect'

const SuspenseSSR: FC<SuspenseProps> = ({ fallback, children }) => {
  const [hydrating, setHydrating] = useState(true)

  useIdleEffect(() => setHydrating(false), [])

  if (hydrating) {
    return <>{fallback}</>
  }

  return <Suspense fallback={fallback}>{children}</Suspense>
}

export default SuspenseSSR
