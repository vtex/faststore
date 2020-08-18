/* global GATSBY_THEME_I18N_REACT_INTL */
import { WrapPageElementBrowserArgs } from "gatsby"
import * as React from "react"
// @ts-ignore
import { IntlProvider } from "react-intl/react-intl-no-parser.umd"


const wrapPageElement = ({ element, props }: WrapPageElementBrowserArgs<object, { locale: string }>) => {
  const locale = props.pageContext.locale
  console.log('teste OIE TESTE')
  // @ts-ignore
  const message = require(`${GATSBY_THEME_I18N_REACT_INTL}/${locale}.json`)
  return (
    // @ts-ignore
    <IntlProvider locale={locale} defaultLocale={locale} messages={message}>
      {element}
    </IntlProvider>
  ) 
}

export { wrapPageElement }
