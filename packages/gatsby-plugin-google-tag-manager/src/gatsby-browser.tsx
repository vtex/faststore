import React from 'react'
import type { WrapRootElementBrowserArgs } from 'gatsby'

const GTMProvider = require('./src/pixel/index').default

export const wrapRootElement = (
  { element }: WrapRootElementBrowserArgs,
  { gtmId }: Props
) => (
  <GTMProvider
    gtmId={gtmId}
    // Overwrites the default blacklist config
    dataLayerConfig={[]}
  >
    {element}
  </GTMProvider>
)

interface Props {
  gtmId: string
}
