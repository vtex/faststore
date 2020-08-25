import * as React from "react"
import { WrapPageElementBrowserArgs } from "gatsby"
import { IntlProvider } from "react-intl"

import LocalizationContextProvider from "./LocalizationContextProvider"

interface PageContext {
  locale: string
  defaultLocale: string
  messages: any
}

export const wrapPageElement = ({ element, props }: WrapPageElementBrowserArgs<object, PageContext>) => {
  const { pageContext: { messages, locale, defaultLocale } } = props
  return (
    <LocalizationContextProvider locale={locale} defaultLocale={defaultLocale}>
      <IntlProvider locale={locale} defaultLocale={defaultLocale} messages={messages}>
        {element}
      </IntlProvider>
    </LocalizationContextProvider>
  )
}
