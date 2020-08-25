import * as React from "react"
import { IntlProvider } from "react-intl"

import LocalizationContextProvider from "./Localization"

// interface PageContext {
//   locale: string
//   defaultLocale: string
//   messages: any
// }

export const Wrapper = ({ children, pageContext }: any) => {
  const { messages, locale, defaultLocale } = pageContext
  console.log('teste wrapPageElement2:', pageContext)
  return (
    <LocalizationContextProvider locale={locale} defaultLocale={defaultLocale}>
      <IntlProvider locale={locale} defaultLocale={defaultLocale} messages={messages}>
        {children}
      </IntlProvider>
    </LocalizationContextProvider>
  )
}
