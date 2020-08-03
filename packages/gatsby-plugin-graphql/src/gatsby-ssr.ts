import { join } from 'path'

import { stripIndent } from 'common-tags'
import { RenderBodyArgs } from 'gatsby'
import { createElement } from 'react'

import { publicPath, queryInfo } from './webpack'
import { PLUGIN_GLOBAL_VARIABLE } from '.'

export const onRenderBody = ({
  setPostBodyComponents,
  setHeadComponents,
}: RenderBodyArgs) => {
  const href = join(publicPath, queryInfo)

  setHeadComponents([
    createElement('link', {
      key: `PRELOAD:${PLUGIN_GLOBAL_VARIABLE}`,
      crossOrigin: 'anonymous',
      rel: 'preload',
      as: 'fetch',
      href,
    }),
  ])

  setPostBodyComponents([
    createElement('script', {
      key: `SCRIPT:${PLUGIN_GLOBAL_VARIABLE}`,
      dangerouslySetInnerHTML: {
        __html: stripIndent`
          window.${PLUGIN_GLOBAL_VARIABLE} = fetch("${href}").then(a => a.json())
        `,
      },
      type: 'application/javascript',
    }),
  ])
}
