import { WrapRootElementBrowserArgs, WrapPageElementBrowserArgs } from 'gatsby'
import { createElement, ElementType, StrictMode } from 'react'
import ReactDOM from 'react-dom'
import 'requestidlecallback-polyfill'

// Webpack + TS magic to make this work
// const { OrderFormProvider } = require('./src/sdk/orderForm/Provider')
const {
  Progress,
  onRouteUpdate: progressOnRouteUpdate,
} = require('./src/sdk/progress')

export const replaceHydrateFunction = () => async (
  element: ElementType,
  container: Element,
  callback: any
) => {
  const { OrderFormProvider } = await import('./src/sdk/orderForm/Provider' as any)
  const { wrapRootElement } = await import('./src/provider' as any)
  const App = createElement(StrictMode, {
    children: createElement(OrderFormProvider, wrapRootElement({ element })),
  })

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

  root.render(App)
}

export const wrapPageElement = ({
  element,
  props: { location },
}: WrapPageElementBrowserArgs) =>
  createElement(Progress, { children: element, location })

export const onRouteUpdate = () => {
  progressOnRouteUpdate()
}
