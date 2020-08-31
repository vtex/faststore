import React, { FC, Suspense, SuspenseProps, useEffect } from 'react'
import { useInView } from 'react-hook-inview'

interface Props extends SuspenseProps {
  preloader: () => Promise<any>
}

const SuspenseViewport: FC<Props> = ({ fallback, children, preloader }) => {
  const [ref, isInView] = useInView({
    unobserveOnEnter: true, // Set 'true' to run only once
    rootMargin: '50px', // '0px' or '0px 0px 0px 0px', also accepts '%' unit
    threshold: 0, // A threshold of 1.0 means that when 100% of the target is visible within the element specified by the root option, the callback is invoked.
  })

  // useEffect(() => {
  //   preloader()
  // }, [preloader])

  if (!isInView) {
    return <div ref={ref}>{fallback}</div>
  }

  return <Suspense fallback={fallback}>{children}</Suspense>
}

export default SuspenseViewport
