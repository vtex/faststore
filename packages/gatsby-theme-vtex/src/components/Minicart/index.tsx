import React, { FC, Fragment, lazy, Suspense, useState, useEffect } from 'react'
import { Box } from '@material-ui/core'

import Button from '../material-ui-components/Button'
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

  // FIXME: Minicart Button style/theme
  return (
    <Fragment>
      <Button
        style={{
          color: 'white',
          background: '#f0f0f0',
          position: 'relative',
          marginLeft: 2,
          cursor: 'pointer',
        }}
        aria-label="Open Cart"
        onClick={toggle}
      >
        <MinicartSvg />
        <SuspenseSSR
          fallback={
            <Box
              style={{
                background: '#f71963',
                borderRadius: '100%',
                height: 16,
                position: 'absolute',
                width: 16,
                top: 0,
                right: 0,
                fontSize: 10,
              }}
            >
              0
            </Box>
          }
        >
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
