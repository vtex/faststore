import React from 'react'
import { IntlProvider } from 'react-intl'
import { WrapPageElementBrowserArgs, WrapPageElementNodeArgs } from 'gatsby'

type Props =
  | WrapPageElementBrowserArgs<any, any>
  | WrapPageElementNodeArgs<any, any>

const wrapPageElement = ({
  props: {
    pageContext: { messages, locale, defaultLocale },
  },
  element: children,
}: Props) => (
  <IntlProvider
    locale={locale}
    defaultLocale={defaultLocale}
    messages={messages}
  >
    {children}
  </IntlProvider>
)

export default wrapPageElement
