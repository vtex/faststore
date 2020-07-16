import React from 'react'
import { RenderBodyArgs } from 'gatsby'

const script = require('./src/utils/script')

export const onRenderBody = ({
  setHeadComponents,
  setPreBodyComponents,
  setPostBodyComponents,
}: RenderBodyArgs) => {
  // if (process.env.NODE_ENV !== 'production') {
  //   return
  // }

  setHeadComponents([
    React.createElement('link', {
      key: 'preconnect-io',
      rel: 'preconnect',
      href: 'https://io.vtex.com.br',
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
