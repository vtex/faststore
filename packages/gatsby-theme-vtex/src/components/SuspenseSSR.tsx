import React, { FC, Suspense, SuspenseProps, useState, useEffect } from 'react'

const SuspenseSSR: FC<SuspenseProps> = ({ fallback, children }) => {
  const [browser, isBrowser] = useState(false)

  useEffect(() => {
    isBrowser(true)
  }, [browser])

  if (browser) {
    return <Suspense fallback={fallback}>{children}</Suspense>
  }

  return <>{fallback}</>
}

export default SuspenseSSR
