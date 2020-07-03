import { WrapPageElementNodeArgs } from 'gatsby'
import { createElement } from 'react'

// Webpack + TS magic to make this work
const { BindingProvider } = require('./src/components/providers/Binding')

export const wrapRootElement = ({ element }: WrapPageElementNodeArgs) =>
  createElement(BindingProvider, {
    children: element,
  } as any)
