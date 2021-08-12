// eslint-disable-next-line spaced-comment
/// <reference types="react-dom/experimental" />

import 'requestidlecallback-polyfill'

import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { UIProvider } from '@vtex/store-sdk'

import ErrorBoundary from './src/components/Error/ErrorBoundary'
import { Provider as OrderFormProvider } from './src/sdk/orderForm/Provider'
import { Provider as VTEXRCProvider } from './src/sdk/pixel/vtexrc/Provider'
import { Provider as RegionProvider } from './src/sdk/region/Provider'
import { Provider as ToastProvider } from './src/sdk/toast/Provider'

export const onClientEntry = async () => {
  if (typeof IntersectionObserver === 'undefined') {
    await import('intersection-observer')
  }
}

export const replaceHydrateFunction = () => (element, container) => {
  let hydrate = true

  // This part will be removed by webpack on production builds since this only
  // serves for React not complaining about mismatches on devMode.
  // We can not just default to `render` mode on devMode because the user may be using
  // DEV_SSR=true flag
  if (process.env.NODE_ENV !== 'production') {
    const focusEl = document.getElementById(`gatsby-focus-wrapper`)

    hydrate = !!focusEl && focusEl.children.length > 0
  }

  // There are versions of React currently exporting createRoot and others exporting unstable_createRoot
  const createRoot = ReactDOM.createRoot || ReactDOM.unstable_createRoot

  createRoot(container, { hydrate }).render(element)
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

  if (process.env.NODE_ENV === 'development') {
    return <StrictMode>{root}</StrictMode>
  }

  return root
}

export const onInitialClientRender = () => {
  globalThis.__REACT_HYDRATED__ = true
}
