import { WrapRootElementBrowserArgs } from 'gatsby'
import { createElement, ElementType, StrictMode } from 'react'
import ReactDOM from 'react-dom'

// Webpack + TS magic to make this work
const { BindingProvider } = require('./src/providers/Binding')
const { OrderFormProvider } = require('./src/providers/OrderForm')

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
    children: createElement(BindingProvider, {
      children: createElement(OrderFormProvider, { children: element }),
    }),
  })
