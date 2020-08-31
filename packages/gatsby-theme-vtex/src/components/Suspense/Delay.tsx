import React, { FC, Suspense, SuspenseProps, useState, useEffect } from 'react'

const SuspenseDelay: FC<SuspenseProps> = ({ fallback, children }) => {
  const [shouldRender, render] = useState(false)

  useEffect(() => {
    render(true)
  }, [])

  if (!shouldRender || !children) {
    return fallback as any
  }

  return <Suspense fallback={fallback}>{children}</Suspense>
}

export default SuspenseDelay
