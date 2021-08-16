import React, { Fragment, useMemo } from 'react'
import type { FC } from 'react'
import { useAnalyticsEvent } from '@vtex/store-sdk'
import { useLazyScript, once } from '@vtex/gatsby-theme-store'

import { handler } from './handler'
import { DEFAULT_DATALAYER_CONFIG } from './constants'
import type { GTMProviderProps } from './types'

const setupGTM = once(
  (
    dataLayerConfig: Array<Record<string, string[]>>,
    allowedHosts: string[] = [window.location.host]
  ) => {
    if (!allowedHosts.includes(window.location.host)) {
      return false
    }

    window.dataLayer = window.dataLayer || []
    for (const item of dataLayerConfig) {
      window.dataLayer.push(item)
    }

    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })

    return true
  }
)

const useSetupGTM = (dataLayerConfig: any[], allowedHosts?: string[]) =>
  // We don't need dataLayerConfig/allowedHosts in hooks deps since setupGTM is run once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => setupGTM(dataLayerConfig, allowedHosts), [])

const Provider: FC<GTMProviderProps> = ({
  children,
  gtmId,
  timeout = 5500,
  dataLayerConfig = DEFAULT_DATALAYER_CONFIG,
  allowedHosts,
}) => {
  // Setup GTM
  const shouldSetup = useSetupGTM(dataLayerConfig, allowedHosts)

  if (shouldSetup === true) {
    // Include GTM's scripts into the page
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLazyScript({
      src: `https://www.googletagmanager.com/gtm.js?id=${gtmId}`,
      id: gtmId,
      timeout,
    })

    // Register Pixel event handler
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAnalyticsEvent(handler)
  }

  return <Fragment>{children}</Fragment>
}

export default Provider
