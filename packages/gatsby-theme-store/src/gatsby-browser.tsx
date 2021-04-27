/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
import 'requestidlecallback-polyfill'

import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import type { WrapRootElementBrowserArgs } from 'gatsby'
import type { ElementType } from 'react'

// Webpack + TS magic to make this work
const {
  Provider: OrderFormProvider,
} = require('./src/sdk/orderForm/LazyProvider')
const { RegionProvider } = require('./src/sdk/region/index')
const { Provider: MinicartProvider } = require('./src/sdk/minicart/Provider')
const { default: VTEXRCProvider } = require('./src/sdk/pixel/vtexrc/index')
const {
  default: ErrorBoundary,
} = require('./src/components/Error/ErrorBoundary')
// eslint-disable-next-line padding-line-between-statements
const {
  Progress,
  onRouteUpdate: progressOnRouteUpdate,
} = require('./src/sdk/progress')
const { Provider: ToastProvider } = require('./src/sdk/toast/Provider')

export const replaceHydrateFunction = () => async (
  element: ElementType,
  container: Element,
  callback: any
) => {
  if (typeof IntersectionObserver === 'undefined') {
    await import('intersection-observer')
  }

  const development = (process.env.GATSBY_BUILD_STAGE as any).includes(
    'develop'
  )

  const { unstable_createRoot: createRoot }: any = ReactDOM
  const root = createRoot(container, {
    hydrate: !development,
    hydrationOptions: {
      onHydrated: callback,
    },
  })

  root.render(element)
}

export const wrapRootElement = ({ element }: WrapRootElementBrowserArgs) => {
  const root = (
    <ErrorBoundary>
      <VTEXRCProvider>
        <ToastProvider>
          <RegionProvider>
            <OrderFormProvider>
              <MinicartProvider>{element}</MinicartProvider>
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

export const wrapPageElement = ({
  element,
  props: { location },
}: WrapRootElementBrowserArgs | any) => (
  <Progress location={location}>{element}</Progress>
)

export const onRouteUpdate = () => {
  progressOnRouteUpdate()
}
