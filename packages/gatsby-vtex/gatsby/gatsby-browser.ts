import { loadableReady } from '@loadable/component'
import { ElementType } from 'react'
import ReactDOM from 'react-dom'

export const replaceHydrateFunction = () => (
  element: ElementType,
  container: Element
) => {
  loadableReady(() => {
    const {
      unstable_createRoot: createRoot,
      unstable_createBlockingRoot: createBlockingRoot,
    }: any = ReactDOM

    createRoot(container).render(element)
  })
}
