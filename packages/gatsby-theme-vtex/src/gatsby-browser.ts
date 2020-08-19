import { WrapRootElementBrowserArgs, WrapPageElementBrowserArgs } from 'gatsby'
import { createElement, ElementType, StrictMode } from 'react'
import ReactDOM from 'react-dom'
import 'requestidlecallback-polyfill'

// Webpack + TS magic to make this work
const { OrderFormProvider } = require('./src/sdk/orderForm/Provider')
const {
  Progress,
  onRouteUpdate: progressOnRouteUpdate,
  onPreRouteUpdate: progressOnPreRouteUpdate
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

export const wrapRootElement = ({ element }: WrapRootElementBrowserArgs) =>
  createElement(StrictMode, {
    children: createElement(OrderFormProvider, { children: element }),
  })

export const wrapPageElement = ({
  element,
  props: { location },
}: WrapPageElementBrowserArgs) =>
  createElement(Progress, { children: element, location })

export const onRouteUpdate = () => {
  progressOnRouteUpdate()
}
