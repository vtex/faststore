import React, { FC, Suspense, SuspenseProps, useState, useEffect } from 'react'

interface Props extends SuspenseProps {
  isPrerendered: boolean
}

const HybridWrapper: FC<Props> = ({ fallback, isPrerendered, children }) => {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (!isPrerendered) {
      setHydrated(true)
    }
  }, [isPrerendered])

  if (isPrerendered) {
    return <>{children}</>
  }

  return hydrated ? (
    <Suspense fallback={fallback}>{children}</Suspense>
  ) : (
    <>{fallback}</>
  )
}

export default HybridWrapper
