import React, { FC, Suspense, SuspenseProps, useState, useEffect } from 'react'

export const SuspenseIdle: FC<SuspenseProps> = ({ fallback, children }) => {
  const [render, setRender] = useState(false)

  useEffect(() => {
    const handler = (window as any).requestIdleCallback?.(() => setRender(true))

    return () => (window as any).cancelIdleCallback?.(handler)
  }, [])

  if (render === false) {
    return fallback as any
  }

  return <Suspense fallback={fallback}>{children}</Suspense>
}
