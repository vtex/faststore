// eslint-disable-next-line spaced-comment
/// <reference types="react-dom/experimental" />

import 'requestidlecallback-polyfill'

import { UIProvider } from '@vtex/store-sdk'
import React, { StrictMode } from 'react'
import { unstable_createRoot as createRoot } from 'react-dom'
import type { WrapRootElementBrowserArgs } from 'gatsby'
import type { ReactChild } from 'react'

import ErrorBoundary from './components/Error/ErrorBoundary'
import { Provider as OrderFormProvider } from './sdk/orderForm/LazyProvider'
import { Provider as VTEXRCProvider } from './sdk/pixel/vtexrc/Provider'
import {
  onRouteUpdate as progressOnRouteUpdate,
  Progress,
} from './sdk/progress'
import { Provider as RegionProvider } from './sdk/region/Provider'
import { Provider as ToastProvider } from './sdk/toast/Provider'

export const replaceHydrateFunction = () => async (
  element: ReactChild,
  container: Element,
  callback: any
) => {
  if (typeof IntersectionObserver === 'undefined') {
    await import('intersection-observer')
  }

  const development = (process.env.GATSBY_BUILD_STAGE as any).includes(
    'develop'
  )

  const root = createRoot(container, {
    hydrate: !development,
  })

  root.render(element, callback)
}

export const wrapRootElement = ({ element }: WrapRootElementBrowserArgs) => {
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

export const wrapPageElement = ({
  element,
  props: { location },
}: WrapRootElementBrowserArgs | any) => (
  <Progress location={location}>{element}</Progress>
)

export const onRouteUpdate = () => {
  progressOnRouteUpdate()
}
