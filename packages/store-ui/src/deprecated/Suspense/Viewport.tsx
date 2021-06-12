import React, { Suspense } from 'react'
import { useInView } from 'react-hook-inview'
import type { FC, SuspenseProps } from 'react'

import { useIdleEffect } from './hooks/useIdleEffect'

interface Props extends SuspenseProps {
  preloader?: () => Promise<any>
  rootMargin?: string // '0px' or '0px 0px 0px 0px', also accepts '%' unit
  threshold?: number // A threshold of 1.0 means that when 100% of the target is visible within the element specified by the root option, the callback is invoked.
}

const noop = () => {}

const SuspenseViewport: FC<Props> = ({
  fallback,
  children,
  preloader = noop,
  rootMargin = '150px',
  threshold = 0,
}) => {
  const [ref, isInView] = useInView({
    unobserveOnEnter: true, // Set 'true' to run only once
    rootMargin,
    threshold,
  })

  useIdleEffect(() => {
    preloader()
  }, [preloader])

  if (!isInView) {
    return <div ref={ref}>{fallback}</div>
  }

  return <Suspense fallback={fallback}>{children}</Suspense>
}

export default SuspenseViewport
