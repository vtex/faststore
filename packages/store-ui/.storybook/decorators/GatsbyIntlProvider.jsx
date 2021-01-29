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

const Provider = (Story) => {
  return (
    <IntlProvider locale="pt" defaultLocale="pt" messages={MessagesPt}>
      {Story()}
    </IntlProvider>
  )
}

export default Provider
