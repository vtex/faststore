import { WrapRootElementBrowserArgs, WrapPageElementBrowserArgs } from 'gatsby'
import { createElement, ElementType, StrictMode } from 'react'
import ReactDOM from 'react-dom'
import 'requestidlecallback-polyfill'

// Webpack + TS magic to make this work
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

export const wrapRootElement = ({ element }: WrapRootElementBrowserArgs) =>  {
  const { OrderFormProvider } = require('./src/sdk/orderForm/Provider')
  return createElement(StrictMode, {
    children: createElement(OrderFormProvider, { children: element }),
  })
}

export const wrapPageElement = ({
  element,
  props: { location },
}: WrapPageElementBrowserArgs) =>  {
  const { Progress } = require('./src/sdk/progress')
  return createElement(Progress, { children: element, location })
}

export const onRouteUpdate = () => {
  const { onRouteUpdate: progressOnRouteUpdate } = require('./src/sdk/progress')
  progressOnRouteUpdate()
}
