import React from 'react'
import type { WrapRootElementBrowserArgs } from 'gatsby'

import type { RecsysProviderProps } from './pixel/types'

const RecsysProvider = require('./src/pixel/index').default

export const wrapRootElement = (
  { element }: WrapRootElementBrowserArgs,
  props: RecsysProviderProps
) => <RecsysProvider {...props}>{element}</RecsysProvider>
