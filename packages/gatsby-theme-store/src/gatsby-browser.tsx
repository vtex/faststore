/* eslint-disable @typescript-eslint/no-require-imports */

import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import type { WrapRootElementBrowserArgs } from 'gatsby'
import type { ElementType } from 'react'

// Webpack + TS magic to make this work
const { OrderFormProvider } = require('./src/sdk/orderForm/Provider')
const { MinicartProvider } = require('./src/sdk/minicart/index')
const { default: VTEXRCProvider } = require('./src/sdk/pixel/vtexrc/index')
const {
  Progress,
  onRouteUpdate: progressOnRouteUpdate,
} = require('./src/sdk/progress')

export const onClientEntry = async () => {
  const polyfillPromise = new Promise<void>((resolve) => {
    __SUBSCRIBE_POLYFILL_IO_EVENT__(resolve)
  })

  await polyfillPromise
}

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
  <Progress location={location}>{element}</Progress>
)

export const onRouteUpdate = () => {
  progressOnRouteUpdate()
}
