import React from 'react'
import { IntlProvider } from '@vtex/gatsby-plugin-i18n'
import MessagesPt from '../i18n/pt.json'

const Provider = (Story) => {
  return (
    <IntlProvider locale="en" defaultLocale="en" messages={MessagesPt}>
      {Story()}
    </IntlProvider>
  )
}

export default Provider
