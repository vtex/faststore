/** @jsx jsx */
import { FC, Fragment, lazy, Suspense, useState, useEffect } from 'react'
import { Box, Button, jsx } from '@vtex/store-ui'

import SuspenseSSR from '../../SuspenseSSR'
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

const Minicart: FC<{ variant?: string }> = ({ variant }) => {
  const [isOpen, setOpen] = useState(false)
  const toggle = () => setOpen(!isOpen)

  useEffect(() => {
    const handler = window.requestIdleCallback(preloadDrawer)

    return () => window.cancelIdleCallback(handler)
  }, [])

  const minicartVariant = `${variant}.minicart`

  return (
    <Fragment>
      <Button variant={minicartVariant} aria-label="Open Cart" onClick={toggle}>
        <MinicartSvg />
        <SuspenseSSR
          fallback={<Box variant={`${minicartVariant}.badge`}>0</Box>}
        >
          <ItemCount variant={minicartVariant} />
        </SuspenseSSR>
      </Button>
      {isOpen ? (
        <Suspense fallback={null}>
          <MinicartDrawer variant={minicartVariant} isOpen onClose={toggle} />
        </Suspense>
      ) : null}
    </Fragment>
  )
}

export default Minicart
