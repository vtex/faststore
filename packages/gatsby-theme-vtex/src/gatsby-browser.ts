import { loadableReady } from '@loadable/component'
import { WrapRootElementBrowserArgs, WrapPageElementBrowserArgs } from 'gatsby'
import { createElement, ElementType, StrictMode } from 'react'
import ReactDOM from 'react-dom'

// Webpack + TS magic to make this work
const { BindingProvider } = require('./src/components/providers/Binding')

export const replaceHydrateFunction = () => (
  element: ElementType,
  container: Element,
  callback: any
) => {
  const development = (process.env.GATSBY_BUILD_STAGE as any).includes(
    'develop'
  )

  loadableReady(() => {
    const { unstable_createRoot: createRoot }: any = ReactDOM
    const root = createRoot(container, {
      hydrate: !development,
      hydrationOptions: {
        onHydrated: callback,
      },
    })
    root.render(element)
  })
}

export const wrapRootElement = ({ element }: WrapRootElementBrowserArgs) =>
  createElement(StrictMode, { children: element })

export const wrapPageElement = ({
  element,
  props: { location },
}: WrapPageElementBrowserArgs) =>
  createElement(BindingProvider, {
    children: element,
    location,
  } as any)
