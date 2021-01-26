import React, { Fragment, useMemo } from 'react'
import type { FC } from 'react'
import { isServer } from '@vtex/gatsby-theme-store/src/utils/env'
import { useLazyScript } from '@vtex/gatsby-theme-store/src/sdk/lazyScript/useLazyScript'
import { usePixelEvent } from '@vtex/gatsby-theme-store/src/sdk/pixel/usePixelEvent'
import { once } from '@vtex/gatsby-theme-store/src/sdk/once'

import { handler } from './handler'

const setupFBPixel = once((pixelId: string) => {
  if (isServer) {
    return
  }

  let n: any

    /* eslint-disable */
  ;(function (w) {
    if (w.fbq) return

    n = w.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    }
    if (!w._fbq) w._fbq = n
    n.push = n
    n.loaded = true
    n.version = '2.0'
    n.queue = []
  })(window)

  fbq('init', pixelId)
  fbq('track', 'PageView')
})

const useSetupFBPixel = (pixelId: string) =>
  // We don't need pixelId in hooks deps since setupFBPixel is run once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => setupFBPixel(pixelId), [])

interface Props {
  pixelId: string
  timeout?: number
}

const Provider: FC<Props> = ({ children, pixelId, timeout = 5500 }) => {
  // Setup FB Pixel
  useSetupFBPixel(pixelId)

  // Include FB pixel's scripts into the page
  useLazyScript({
    src: `https://connect.facebook.net/en_US/fbevents.js`,
    id: pixelId,
    timeout,
  })

  // Register Pixel event handler
  usePixelEvent(handler)

  return <Fragment>{children}</Fragment>
}

export default Provider
