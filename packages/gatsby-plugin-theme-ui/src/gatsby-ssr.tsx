import React from 'react'
import { renderToString } from 'react-dom/server'
import { ReplaceRendererArgs, WrapRootElementBrowserArgs } from 'gatsby'
import { CacheProvider } from '@emotion/core'
// import createEmotionServer from 'create-emotion-server'
import createCache from '@emotion/cache'

const { ThemeProvider } = require('./src/components/provider')

export const wrapRootElement = ({ element }: WrapRootElementBrowserArgs) => {
  const cache = createCache()

  return (
    <CacheProvider value={cache}>
      <ThemeProvider>{element}</ThemeProvider>
    </CacheProvider>
  )
}

export const replaceRenderer = ({
  bodyComponent,
  replaceBodyHTMLString,
}: ReplaceRendererArgs) => {
  const bodyHTML = renderToString(bodyComponent as any)

  replaceBodyHTMLString(bodyHTML)
}
