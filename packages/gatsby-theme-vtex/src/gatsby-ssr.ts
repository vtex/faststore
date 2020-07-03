import { WrapPageElementNodeArgs } from 'gatsby'
import { createElement } from 'react'

// Webpack + TS magic to make this work
const { BindingProvider } = require('./src/components/providers/Binding')

export const wrapPageElement = ({
  element,
  props: { location },
}: WrapPageElementNodeArgs) =>
  createElement(BindingProvider, {
    children: element,
    location,
  } as any)
