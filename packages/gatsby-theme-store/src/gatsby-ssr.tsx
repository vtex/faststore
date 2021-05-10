const React = require('react')
import type { RenderBodyArgs } from 'gatsby'

import { handleUserBackOnline } from './sdk/offline'


exports.onPreRenderHTML = ({
  replacePostBodyComponents,
  getPostBodyComponents,
}: any) => {
  const postBodyComponents = getPostBodyComponents()
  const version="0.0.0-experimental-7f28234f8"
  const reactScript = React.createElement('script', {
    src: `https://unpkg.com/react@${version}/umd/react.production.min.js`
  })
  const reactDomScript = React.createElement('script', {
    src: `https://unpkg.com/react-dom@${version}/umd/react-dom.production.min.js`
  })
  replacePostBodyComponents(([] as any).concat([reactScript, reactDomScript]).concat(React.Children.toArray(postBodyComponents)))
}

export const onRenderBody = ({
  setPostBodyComponents,
  pathname,
}: RenderBodyArgs) => {
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
