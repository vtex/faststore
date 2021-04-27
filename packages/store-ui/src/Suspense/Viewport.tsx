import React, { Suspense, useEffect, useState } from 'react'
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
  const [shouldRender, setShouldRender] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const [ref, isInView] = useInView({
    unobserveOnEnter: true, // Set 'true' to run only once
    rootMargin,
    threshold,
  })

  useIdleEffect(() => {
    // preloader()
    console.log('should render by idle')
    setShouldRender(true)
  }, [preloader])

  useEffect(() => {
    if (hasInteracted) {
      return
    }

    const setInteraction = () => {
      console.log('has interacted')
      setHasInteracted(true)
    }

    window.addEventListener('mousemove', setInteraction)

    return () => {
      window.removeEventListener('mousemove', setInteraction)
    }
  }, [hasInteracted, setHasInteracted])

  const shouldRenderByIdle = shouldRender
  const shouldRenderByView = isInView && hasInteracted

  console.log({ shouldRenderByIdle, shouldRenderByView })
  if (!shouldRenderByIdle && !shouldRenderByView) {
    return <div ref={ref}>{fallback}</div>
  }

  return <Suspense fallback={fallback}>{children}</Suspense>
}

export default SuspenseViewport
