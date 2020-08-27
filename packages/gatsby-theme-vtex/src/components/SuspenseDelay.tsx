import React, { FC, Suspense, SuspenseProps, useState, useEffect } from 'react'

const SuspenseDelay: FC<SuspenseProps> = ({ fallback, children }) => {
  const [shouldRender, render] = useState(false)

  useEffect(() => {
    const handler = window.requestIdleCallback(() => render(true))

    return () => window.cancelIdleCallback(handler)
  }, [])

  if (!shouldRender || !children) {
    return fallback as any
  }

  return <Suspense fallback={fallback}>{children}</Suspense>
}

export default SuspenseDelay
