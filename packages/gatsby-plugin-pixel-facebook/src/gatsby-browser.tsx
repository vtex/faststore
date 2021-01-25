import React from 'react'
import type { WrapRootElementBrowserArgs } from 'gatsby'

const FBPixel = require('./src/pixel/index').default

export const wrapRootElement = ({ element }: WrapRootElementBrowserArgs) => {
  return <FBPixel pixelId="912960579449510">{element}</FBPixel>
}
