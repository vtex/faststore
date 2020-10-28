import React, { FC, Suspense, SuspenseProps, useEffect, useState } from 'react'

const SuspenseSSR: FC<SuspenseProps> = ({ fallback, children }) => {
  const [hydrating, setHydrating] = useState(true)

  useEffect(() => {
    const id = window.requestIdleCallback(() => setHydrating(false))

    return () => window.cancelIdleCallback(id)
  }, [])

  if (hydrating) {
    return <>{fallback}</>
  }

  return <Suspense fallback={fallback}>{children}</Suspense>
}

export default SuspenseSSR
