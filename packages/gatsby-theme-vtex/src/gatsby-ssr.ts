import { ThemeProvider } from '@vtex/store-ui'
import { RenderBodyArgs, WrapRootElementBrowserArgs } from 'gatsby'
import React, { createElement } from 'react'

import theme from './theme'

const script = require('./src/utils/script')

export const onRenderBody = ({
  setHeadComponents,
  setPostBodyComponents,
}: RenderBodyArgs) => {
  setHeadComponents([
    React.createElement('link', {
      key: 'dns-prefetch-io-vtex',
      rel: 'dns-prefetch',
      href: 'https://io.vtex.com.br/',
    }),
    React.createElement('link', {
      key: 'dns-prefetch-rc-vtex',
      rel: 'dns-prefetch',
      href: 'https://rc.vtex.com.br/',
    }),
    script.sync({
      innerHtml:
        'window.vtexrca=window.vtexrca||function(){(vtexrca.q=vtexrca.q||[]).push(arguments)};vtexrca.l=+new Date;',
    }),
  ])

  setPostBodyComponents([
    script.lazy({
      src: 'https://io.vtex.com.br/rc/rc.js',
      id: 'async-vtex-rc',
    }),
  ])
}

export const wrapRootElement = ({
  element: children,
}: WrapRootElementBrowserArgs) =>
  createElement(ThemeProvider, { theme, children })
