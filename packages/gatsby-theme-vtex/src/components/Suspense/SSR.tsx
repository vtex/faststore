import React, { FC, Suspense, SuspenseProps, useEffect, useState } from 'react'

interface Props extends SuspenseProps {
  // False to not wait for hydration before suspending.
  // Use it carefully since it may break some libs
  hydration?: boolean
  preloader?: () => Promise<any>
}

const SuspenseSSR: FC<Props> = ({
  fallback,
  children,
  hydration = true,
  preloader,
}) => {
  const [hydrating, setHydrating] = useState(hydration)

  useEffect(() => {
    if (hydrating === true) {
      setHydrating(false)
    }
  }, [hydrating])

  useEffect(() => {
    preloader?.()
  }, [preloader])

  if (hydrating) {
    return <>{fallback}</>
  }

  return <Suspense fallback={fallback}>{children}</Suspense>
}

export default SuspenseSSR
