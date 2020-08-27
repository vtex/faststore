import React, { FC, Suspense, SuspenseProps, useEffect } from 'react'

import { useScroll } from '../sdk/utils/useScroll'

interface Props extends SuspenseProps {
  preloader: () => Promise<any>
}

const SuspenseScroll: FC<Props> = ({ fallback, children, preloader }) => {
  const scroll = useScroll()

  useEffect(() => {
    preloader()
  }, [preloader])

  if (scroll === 0) {
    return <>{fallback}</>
  }

  return <Suspense fallback={fallback}>{children}</Suspense>
}

export default SuspenseScroll
