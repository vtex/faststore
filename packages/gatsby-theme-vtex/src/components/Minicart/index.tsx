/** @jsx jsx */
import { jsx } from '@vtex/store-ui'
import { FC, Fragment, lazy, Suspense, useEffect, useState } from 'react'

import CustomMinicartButton from './Button'

const preloadDrawer = () => import('./Drawer')

const MinicartDrawer = lazy(preloadDrawer)

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
      <CustomMinicartButton variant={customVariant} onClick={toggle} />
      {isOpen ? (
        <Suspense fallback={null}>
          <MinicartDrawer variant={customVariant} isOpen onClose={toggle} />
        </Suspense>
      ) : null}
    </Fragment>
  )
}

export default Minicart
