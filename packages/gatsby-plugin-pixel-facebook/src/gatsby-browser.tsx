import React from 'react'
import type { WrapRootElementBrowserArgs } from 'gatsby'

import type { FBPixelProviderProps } from './pixel/types'

const FBPixelProvider = require('./src/pixel/index').default

export const wrapRootElement = (
  { element }: WrapRootElementBrowserArgs,
  props: FBPixelProviderProps
) => {
  return <FBPixelProvider {...props}>{element}</FBPixelProvider>
}
