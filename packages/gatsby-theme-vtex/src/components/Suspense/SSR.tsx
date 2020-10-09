import React, { FC, Suspense, SuspenseProps, useEffect, useState } from 'react'

const SuspenseSSR: FC<SuspenseProps> = ({ fallback, children }) => {
  const [hydrating, setHydrating] = useState(true)

  useEffect(() => setHydrating(false), [])

  if (hydrating) {
    return <>{fallback}</>
  }

  return <Suspense fallback={fallback}>{children}</Suspense>
}

export default SuspenseSSR
