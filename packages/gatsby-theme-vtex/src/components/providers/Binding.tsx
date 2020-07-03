import { graphql, useStaticQuery } from 'gatsby'
import React, { createContext, FC, useContext, useMemo } from 'react'

import { isServer } from '../../utils/env'

interface Binding {
  locale: string
  currency: string
  salesChannel: number
  supportedLocales: string
  supportedCurrencies: string
}

const BindingContext = createContext<Binding>(null as any)

export const BindingProvider: FC = ({ children }) => {
  const { allBinding } = useStaticQuery(graphql`
    query {
      allBinding(
        filter: { targetProduct: { eq: "vtex-storefront" } }
        limit: 1
      ) {
        edges {
          node {
            defaultCurrency
            defaultLocale
            salesChannel
            supportedLocales
            supportedCurrencies
          }
        }
      }
    }
  `)
  const {
    defaultLocale,
    defaultCurrency,
    salesChannel,
    supportedLocales,
    supportedCurrencies,
  } = allBinding.edges[0].node

  const binding = useMemo(() => {
    const searchParams = new URLSearchParams(
      isServer ? '' : window.location.search
    )
    return {
      locale: searchParams.get('locale') ?? defaultLocale,
      currency: searchParams.get('currency') ?? defaultCurrency,
      salesChannel: searchParams.get('sc') ?? salesChannel,
      supportedLocales,
      supportedCurrencies,
    }
  }, [
    defaultLocale,
    defaultCurrency,
    salesChannel,
    supportedLocales,
    supportedCurrencies,
  ])

  return (
    <BindingContext.Provider value={binding}>
      {children}
    </BindingContext.Provider>
  )
}

const setQs = (qs: string) => {
  window.location.search =
    window.location.search.length === 0
      ? `?${qs}`
      : `${window.location.search}&${qs}`
}

export const useCurrency = (): [string, typeof setQs] => {
  const { currency } = useContext(BindingContext)
  return [currency, (c: string) => setQs(`currency=${c}`)]
}

export const useLocale = (): [string, typeof setQs] => {
  const { locale } = useContext(BindingContext)
  return [locale, (l: string) => setQs(`locale=${l}`)]
}

export const useSalesChannel = (): [number, typeof setQs] => {
  const { salesChannel } = useContext(BindingContext)
  return [salesChannel, (sc: string) => setQs(`sc=${sc}`)]
}
