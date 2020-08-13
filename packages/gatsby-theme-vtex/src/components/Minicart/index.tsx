/** @jsx jsx */
import { jsx } from '@vtex/store-ui'
import { FC, Fragment, lazy, Suspense, useEffect, useState } from 'react'

const preloadDrawer = () => import('./Drawer')
const MinicartButton = lazy(() => import('./Button'))

const MinicartDrawer = lazy(preloadDrawer)

declare global {
  interface Window {
    requestIdleCallback: any
    cancelIdleCallback: any
  }
}

const Minicart: FC = () => {
  const [isOpen, setOpen] = useState(false)
  const toggle = () => setOpen(!isOpen)

  useEffect(() => {
    const handler = window.requestIdleCallback(preloadDrawer)

    return () => window.cancelIdleCallback(handler)
  }, [])

  const customVariant = 'minicart'

  return (
    <Fragment>
      <MinicartButton variant={customVariant} onClick={toggle} />
      {isOpen ? (
        <Suspense fallback={null}>
          <MinicartDrawer variant={customVariant} isOpen onClose={toggle} />
        </Suspense>
      ) : null}
    </Fragment>
  )
}

export default Minicart
