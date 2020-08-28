import React from 'react'
import { IntlProvider } from 'react-intl'
import { WrapRootElementBrowserArgs, WrapRootElementNodeArgs } from 'gatsby'

type Props =
  | WrapRootElementBrowserArgs<any, any>
  | WrapRootElementNodeArgs<any, any>

export const wrapPageElement = ({
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
