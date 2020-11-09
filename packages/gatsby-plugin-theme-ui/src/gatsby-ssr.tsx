import React from 'react'
import { renderToString } from 'react-dom/server'
import { ReplaceRendererArgs, WrapRootElementBrowserArgs } from 'gatsby'
import { CacheProvider } from '@emotion/core'
import createEmotionServer from 'create-emotion-server'
import createCache from '@emotion/cache'

const { ThemeProvider } = require('./src/components/Provider')

export const wrapRootElement = ({ element }: WrapRootElementBrowserArgs) => (
  <ThemeProvider>{element}</ThemeProvider>
)

// The following function was heavily inspired in emotion's advanced SSR approach
// https://github.com/emotion-js/emotion/blob/4400d8564c771953121342c20f6ad764a0830328/docs/ssr.mdx
export const replaceRenderer = ({
  bodyComponent,
  replaceBodyHTMLString,
  setHeadComponents,
}: ReplaceRendererArgs) => {
  const cache = createCache()
  const { extractCritical } = createEmotionServer(cache)

  const root = (
    <CacheProvider value={cache}>{bodyComponent as JSX.Element}</CacheProvider>
  )

  const { html, css, ids } = extractCritical(renderToString(root))

  setHeadComponents([
    <style
      key="data-emotion-css"
      data-emotion-css={ids.join(' ')}
      dangerouslySetInnerHTML={{ __html: css }}
    />,
  ])

  replaceBodyHTMLString(html)
}
