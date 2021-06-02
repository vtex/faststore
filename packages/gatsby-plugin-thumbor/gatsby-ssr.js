import React from 'react'

// Force webpack to resolve to the right (es-module) file
import { Provider } from '@vtex/gatsby-plugin-thumbor'

export const wrapRootElement = ({ element }, options) => (
  <Provider options={options}>{element}</Provider>
)
