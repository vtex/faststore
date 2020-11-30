import React, { FC, Fragment, useMemo } from 'react'

import { isServer } from '../../../utils/env'
import { useLazyScript } from '../../lazyScript/useLazyScript'
import { once } from '../../once'
import { usePixelEvent } from '../usePixelEvent'
import { handler } from './handler'

const DEFAULT_DATALAYER_CONFIG = [{ 'gtm.blacklist': ['html'] }]

const setupGTM = once((dataLayerConfig: any[]) => {
  if (isServer) {
    return
  }

  window.dataLayer = window.dataLayer || []

  for (const item of dataLayerConfig) {
    window.dataLayer.push(item)
  }

  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
})

const useSetupGTM = (dataLayerConfig: any[]) =>
  // We don't need dataLayerConfig in hooks deps since setupGTM is run once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => setupGTM(dataLayerConfig), [])

interface Props {
  gtmId: string
  timeout?: number
  dataLayerConfig?: any[]
}

const Provider: FC<Props> = ({
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
