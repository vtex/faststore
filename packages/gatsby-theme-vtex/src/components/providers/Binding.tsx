import { graphql, useStaticQuery } from 'gatsby'
import React, { createContext, FC, useContext, useMemo, useEffect } from 'react'

import { isServer } from '../../utils/env'

interface Binding {
  locale: string
  currency: string
  salesChannel: number
  supportedLocales: string
  supportedCurrencies: string
}

const BindingContext = createContext<Binding>(null as any)

const localStorage = {
  get: (): Binding | null => {
    const item = window.localStorage.getItem('vtex_binding')
    return item ? JSON.parse(item) : null
  },
  set: (binding: Binding) => {
    window.localStorage.setItem('vtex_binding', JSON.stringify(binding))
  },
}

const useBinding = ({
  defaultLocale,
  defaultCurrency,
  salesChannel,
  supportedLocales,
  supportedCurrencies,
}: Binding & { defaultLocale: string; defaultCurrency: string }) =>
  useMemo(() => {
    if (isServer) {
      return {
        locale: defaultLocale,
        currency: defaultCurrency,
        salesChannel,
        supportedLocales,
        supportedCurrencies,
      }
    }

    const searchParams = new URLSearchParams(window.location.search)
    const storage = localStorage.get()

    return {
      locale: searchParams.get('locale') ?? storage?.locale ?? defaultLocale,
      currency:
        searchParams.get('currency') ?? storage?.currency ?? defaultCurrency,
      salesChannel: Number(
        searchParams.get('sc') ?? storage?.salesChannel ?? salesChannel
      ),
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
  const binding = useBinding(allBinding.edges[0].node)

  useEffect(() => localStorage.set(binding), [binding])

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
