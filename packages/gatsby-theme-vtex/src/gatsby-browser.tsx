/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
import 'requestidlecallback-polyfill'

import { WrapRootElementBrowserArgs } from 'gatsby'
import React, { ElementType, StrictMode } from 'react'
import ReactDOM from 'react-dom'

import ErrorBoundary from './components/Error/ErrorBoundary'
import DefaultErrorHandler from './components/Error/ErrorHandler'

// Webpack + TS magic to make this work
const { OrderFormProvider } = require('./src/sdk/orderForm/Provider')
const { default: VTEXRCProvider } = require('./src/sdk/pixel/vtexrc/index')
const {
  Progress,
  onRouteUpdate: progressOnRouteUpdate,
} = require('./src/sdk/progress')

export const replaceHydrateFunction = () => (
  element: ElementType,
  container: Element,
  callback: any
) => {
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
    <ErrorBoundary fallback={(error) => <DefaultErrorHandler error={error} />}>
      <VTEXRCProvider>
        <OrderFormProvider>{element}</OrderFormProvider>
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
