import { WrapRootElementBrowserArgs } from 'gatsby'
import { createElement, ElementType, StrictMode } from 'react'
import ReactDOM from 'react-dom'
import 'requestidlecallback-polyfill'
import NProgress from 'nprogress'

// Webpack + TS magic to make this work
const { OrderFormProvider } = require('./src/sdk/orderForm/Provider')

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

const defaultOptions = { color: `#29d`, showSpinner: false }

export const onClientEntry = (_: unknown, pluginOptions = {}) => {
  // Merge default options with user defined options in `gatsby-config.js`
  const options = { ...defaultOptions, ...pluginOptions }

  // Inject styles.
  const styles = `
    #nprogress {
      pointer-events: none;
    }
    #nprogress .bar {
      background: ${options.color};
      position: fixed;
      z-index: 1031;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
    }
    #nprogress .peg {
      display: block;
      position: absolute;
      right: 0px;
      width: 100px;
      height: 100%;
      box-shadow: 0 0 10px ${options.color}, 0 0 5px ${options.color};
      opacity: 1.0;
      -webkit-transform: rotate(3deg) translate(0px, -4px);
      -ms-transform: rotate(3deg) translate(0px, -4px);
      transform: rotate(3deg) translate(0px, -4px);
    }
    #nprogress .spinner {
      display: block;
      position: fixed;
      z-index: 1031;
      top: 15px;
      right: 15px;
    }
    #nprogress .spinner-icon {
      width: 18px;
      height: 18px;
      box-sizing: border-box;
      border: solid 2px transparent;
      border-top-color: ${options.color};
      border-left-color: ${options.color};
      border-radius: 50%;
      -webkit-animation: nprogress-spinner 400ms linear infinite;
      animation: nprogress-spinner 400ms linear infinite;
    }
    .nprogress-custom-parent {
      overflow: hidden;
      position: relative;
    }
    .nprogress-custom-parent #nprogress .spinner,
    .nprogress-custom-parent #nprogress .bar {
      position: absolute;
    }
    @-webkit-keyframes nprogress-spinner {
      0% {
        -webkit-transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
      }
    }
    @keyframes nprogress-spinner {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `

  const node = document.createElement(`style`)

  node.id = `nprogress-styles`
  node.innerHTML = styles
  document.head.appendChild(node)

  NProgress.configure(options)
  ;(window as any).NProgress = NProgress
}

// export const onPreRouteUpdate = () => {
//   console.log('onPreRouteUpdate')
//   NProgress.start()
// }

// export const onRouteUpdate = () => {
//   console.log('done')
//   NProgress.done()
// }
