import React from 'react'
import type { WrapRootElementBrowserArgs } from 'gatsby'

import type { GTMProviderProps } from './pixel/types'

const GTMProvider = require('./src/pixel/index').default

export const wrapRootElement = (
  { element }: WrapRootElementBrowserArgs,
  props: GTMProviderProps
) => <GTMProvider {...props}>{element}</GTMProvider>
