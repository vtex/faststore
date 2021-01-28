import React from 'react'
import { IntlProvider } from '@vtex/gatsby-plugin-i18n'
import MessagesPt from '../i18n/pt.json'

// We can use the code below if we add more languages in the future.

// const locales = ['pt']

// const messages: any = locales.reduce((acc, locale) => {
//   return {
//     ...acc,
//     [locale]: require(`../i18n/${locale}.json`),
//   }
// }, {})

const GatsbyIntlProvider = ({ children }) => {
  return (
    <IntlProvider locale="pt" defaultLocale="pt" messages={MessagesPt}>
      {children}
    </IntlProvider>
  )
}

export default GatsbyIntlProvider
