// eslint-disable-next-line spaced-comment
/// <reference types="react-dom/experimental" />

import 'requestidlecallback-polyfill'

import React, { StrictMode } from 'react'
import { UIProvider } from '@vtex/store-sdk'
import { createRoot } from 'react-dom'

import ErrorBoundary from './src/components/Error/ErrorBoundary'
import { Provider as OrderFormProvider } from './src/sdk/orderForm/Provider'
import { Provider as VTEXRCProvider } from './src/sdk/pixel/vtexrc/Provider'
import {
  onRouteUpdate as progressOnRouteUpdate,
  Progress,
} from './src/sdk/progress'
import { Provider as RegionProvider } from './src/sdk/region/Provider'
import { Provider as ToastProvider } from './src/sdk/toast/Provider'

export const onClientEntry = async () => {
  if (typeof IntersectionObserver === 'undefined') {
    await import('intersection-observer')
  }
}

export const wrapRootElement = ({ element }) => {
  const root = (
    <ErrorBoundary>
      <VTEXRCProvider>
        <ToastProvider>
          <RegionProvider>
            <OrderFormProvider>
              <UIProvider>{element}</UIProvider>
            </OrderFormProvider>
          </RegionProvider>
        </ToastProvider>
      </VTEXRCProvider>
    </ErrorBoundary>
  )

  return root
}

export const onInitialClientRender = () => {
  globalThis.__REACT_HYDRATED__ = true
}

export const wrapPageElement = ({ element, props: { location } }) => (
  <Progress location={location}>{element}</Progress>
)

export const onRouteUpdate = () => {
  progressOnRouteUpdate()
}
