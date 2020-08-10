/** @jsx jsx */
import { FC, Fragment, lazy, Suspense, useState, useEffect } from 'react'
import { Box, Button, jsx } from '@vtex/store-ui'

import SuspenseSSR from '../SuspenseSSR'
import MinicartSvg from './Svg'

const preloadDrawer = () => import('./Drawer')
const ItemCount = lazy(() => import('./ItemCount'))

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

  return (
    <Fragment>
      <Button variant="header-minicart" aria-label="Open Cart" onClick={toggle}>
        <MinicartSvg />
        <SuspenseSSR fallback={<Box variant="header-minicart-badge">0</Box>}>
          <ItemCount />
        </SuspenseSSR>
      </Button>
      {isOpen ? (
        <Suspense fallback={null}>
          <MinicartDrawer isOpen onClose={toggle} />
        </Suspense>
      ) : null}
    </Fragment>
  )
}

export default Minicart
