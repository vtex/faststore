import React, { Fragment, useMemo } from 'react'
import type { FC } from 'react'
import { isServer } from '@vtex/gatsby-theme-store/src/utils/env'
import { useLazyScript } from '@vtex/gatsby-theme-store/src/sdk/lazyScript/useLazyScript'
import { usePixelEvent } from '@vtex/gatsby-theme-store/src/sdk/pixel/usePixelEvent'
import { once } from '@vtex/gatsby-theme-store/src/sdk/once'

import { handler } from './handler'
import { DEFAULT_DATALAYER_CONFIG } from './constants'
import type { GTMProviderProps } from './types'

const setupGTM = once((dataLayerConfig: Array<Record<string, string[]>>) => {
  if (isServer) {
    return
  }

  window.dataLayer = window.dataLayer || []
  console.log(dataLayerConfig)
  for (const item of dataLayerConfig) {
    window.dataLayer.push(item)
  }

  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
})

const useSetupGTM = (dataLayerConfig: any[]) =>
  // We don't need dataLayerConfig in hooks deps since setupGTM is run once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => setupGTM(dataLayerConfig), [])

const Provider: FC<GTMProviderProps> = ({
  children,
  gtmId,
  timeout = 5500,
  dataLayerConfig = DEFAULT_DATALAYER_CONFIG,
}) => {
  // Setup GTM
  useSetupGTM(dataLayerConfig)

  // Include GTM's scripts into the page
  useLazyScript({
    src: `https://www.googletagmanager.com/gtm.js?id=${gtmId}`,
    id: gtmId,
    timeout,
  })

  // Register Pixel event handler
  usePixelEvent(handler)

  return <Fragment>{children}</Fragment>
}

export default Provider
