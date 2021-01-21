import React from 'react'
import type { WrapRootElementBrowserArgs } from 'gatsby'

import { GTMProviderProps } from './pixel/types'

const GTMProvider = require('./src/pixel/index').default
const { GTMProviderProps } = require('./src/pixel/types')

const DEFAULT_DATALAYER_CONFIG = [{ 'gtm.blacklist': ['html'] }]

export const wrapRootElement = (
  { element }: WrapRootElementBrowserArgs,
  { gtmId, dataLayerConfig = DEFAULT_DATALAYER_CONFIG }: GTMProviderProps
) => (
  <GTMProvider gtmId={gtmId} dataLayerConfig={dataLayerConfig}>
    {element}
  </GTMProvider>
)
