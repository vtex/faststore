import React from 'react'
import { renderToString } from 'react-dom/server'
import { ReplaceRendererArgs, WrapRootElementBrowserArgs } from 'gatsby'
import { CacheProvider } from '@emotion/core'
import createEmotionServer from 'create-emotion-server'
import createCache from '@emotion/cache'

const { ThemeProvider } = require('./src/components/provider')

export const wrapRootElement = ({ element }: WrapRootElementBrowserArgs) => (
  <ThemeProvider>{element}</ThemeProvider>
)

export const replaceRenderer = ({
  bodyComponent,
  replaceBodyHTMLString,
  setHeadComponents
}: ReplaceRendererArgs) => {
  const cache = createCache()
  const { extractCritical } = createEmotionServer(cache)

  const root = (
    <CacheProvider value={cache}>
      {bodyComponent as JSX.Element}
    </CacheProvider>
  )

  const { html, css, ids } = extractCritical(renderToString(root))

  setHeadComponents([
    <style data-emotion-css={ids.join(' ')}>{css}</style>
  ])

  replaceBodyHTMLString(html)
}
