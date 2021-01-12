/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
import 'requestidlecallback-polyfill'

import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import type { WrapRootElementBrowserArgs } from 'gatsby'
import type { ElementType } from 'react'

// Webpack + TS magic to make this work
const { OrderFormProvider } = require('./src/sdk/orderForm/Provider')
const { MinicartProvider } = require('./src/sdk/minicart/index')
const { default: VTEXRCProvider } = require('./src/sdk/pixel/vtexrc/index')
const { default: ErrorHandler } = require('./src/components/Error/ErrorHandler')
const {
  default: ErrorBoundary,
} = require('./src/components/Error/ErrorBoundary')
// eslint-disable-next-line padding-line-between-statements
const {
  Progress,
  onRouteUpdate: progressOnRouteUpdate,
} = require('./src/sdk/progress')

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
    <VTEXRCProvider>
      <OrderFormProvider>
        <MinicartProvider>{element}</MinicartProvider>
      </OrderFormProvider>
    </VTEXRCProvider>
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
  <ErrorBoundary fallback={(error: any) => <ErrorHandler error={error} />}>
    <Progress location={location}>{element}</Progress>
  </ErrorBoundary>
)

export const onRouteUpdate = () => {
  progressOnRouteUpdate()
}
