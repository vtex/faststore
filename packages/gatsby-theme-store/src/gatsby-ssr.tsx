const React = require('react')
import type { RenderBodyArgs } from 'gatsby'

import { handleUserBackOnline } from './sdk/offline'


// exports.onRenderBody = ({
//   // replacePostBodyComponents,
//   // getPostBodyComponents,
//   // replaceHeadComponents,
//   setHeadComponents,
//   // getHeadComponents,
// }: any) => {
//   // const prevComponents = getPostBodyComponents()
//   // const prevComponents = getHeadComponents()
//   // replaceHeadComponents(([] as any).concat(scripts).concat(React.Children.toArray(prevComponents)))
// }

export const onRenderBody = ({
  setPostBodyComponents,
  setHeadComponents,
  pathname,
}: RenderBodyArgs) => {

  const version="0.0.0-experimental-7f28234f8"

  const createScript = (src: string) => {
    return [
      React.createElement('link', { rel: "preload", as: "script", href: src }),
      React.createElement('script', { src }),
    ]
  }

  const scripts = [
    ...createScript(`https://unpkg.com/react@${version}/umd/react.production.min.js`),
    ...createScript(`https://unpkg.com/react-dom@${version}/umd/react-dom.production.min.js`),
    ...createScript('https://unpkg.com/intl-messageformat@9.5.3/intl-messageformat.iife.js'),
  ]

  setHeadComponents(scripts)

  if (!pathname.startsWith('/offline')) {
    return null
  }

  // The following `<script>` tag should only be added to an offline page.
  return setPostBodyComponents([
    <script
      key="offline-online-handler"
      dangerouslySetInnerHTML={{
        __html: `
            ${handleUserBackOnline.toString()}

            window.addEventListener('online', handleUserBackOnline)
         `,
      }}
    />,
  ])
}
