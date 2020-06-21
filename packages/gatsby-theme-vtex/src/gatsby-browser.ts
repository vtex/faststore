import { loadableReady } from '@loadable/component'
import { WrapRootElementBrowserArgs } from 'gatsby'
import { createElement, ElementType, StrictMode } from 'react'
import ReactDOM from 'react-dom'

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
