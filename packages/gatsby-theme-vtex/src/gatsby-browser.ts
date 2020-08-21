import { ThemeProvider } from '@vtex/store-ui'
import { WrapPageElementBrowserArgs, WrapRootElementBrowserArgs } from 'gatsby'
import { createElement, ElementType, StrictMode } from 'react'
import ReactDOM from 'react-dom'

import 'requestidlecallback-polyfill'

// import { theme } from './theme'

// Webpack + TS magic to make this work
const { default: theme } = require('./theme')
const { OrderFormProvider } = require('./src/sdk/orderForm/Provider')
const {
  Progress,
  onRouteUpdate: progressOnRouteUpdate,
} = require('./src/sdk/progress')

console.log('theme', theme)

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

export const wrapRootElement = ({
  element: children,
}: WrapRootElementBrowserArgs) =>
  createElement(StrictMode, {
    children: createElement(ThemeProvider, {
      theme,
      children: createElement(OrderFormProvider, { children }),
    }),
  })

export const wrapPageElement = ({
  element,
  props: { location },
}: WrapPageElementBrowserArgs) =>
  createElement(Progress, { children: element, location })

export const onRouteUpdate = () => {
  progressOnRouteUpdate()
}
