import { createElement } from 'react'
import { IntlProvider } from 'react-intl'

import LocalizationContextProvider from './components/LocalizationContextProvider'

export const wrapPageElement = ({ element: children, props }: any) => {
  const {
    pageContext: { messages, locale, defaultLocale },
  } = props

  return createElement(IntlProvider, {
    locale,
    defaultLocale,
    messages,
    children: createElement(LocalizationContextProvider, {
      locale,
      defaultLocale,
      children,
    }),
  })
}
