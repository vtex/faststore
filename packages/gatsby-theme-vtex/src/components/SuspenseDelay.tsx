import React, { FC, Suspense, SuspenseProps, useState, useEffect } from 'react'

const SuspenseDelay: FC<SuspenseProps> = ({ fallback, children }) => {
  const [shouldRender, render] = useState(false)

  useEffect(() => {
    render(true)
  }, [])

  if (!shouldRender || !children) {
    return null
  }

  return <Suspense fallback={fallback}>{children}</Suspense>
}

export default SuspenseDelay
