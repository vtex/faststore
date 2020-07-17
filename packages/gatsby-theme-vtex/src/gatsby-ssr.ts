import React from 'react'
import { RenderBodyArgs } from 'gatsby'

const script = require('./src/utils/script')

export const onRenderBody = ({
  setHeadComponents,
  setPostBodyComponents,
}: RenderBodyArgs) => {
  setHeadComponents([
    React.createElement('link', {
      key: 'preconnect-io-vtex',
      rel: 'preconnect',
      crossOrigin: 'true',
      href: 'https://io.vtex.com.br',
    }),
    React.createElement('link', {
      key: 'preconnect-rc-vtex',
      rel: 'preconnect',
      crossOrigin: 'true',
      href: 'https://rc.vtex.com.br',
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
