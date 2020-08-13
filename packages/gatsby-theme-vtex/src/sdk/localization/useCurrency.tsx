import { graphql, useStaticQuery } from 'gatsby'

import { usePersistedSearchParams } from '../state/usePersistedSearchParams'

const key = 'currency'

export const useCurrency = () => {
  const {
    allChannel: { edges },
  } = useStaticQuery(graphql`
    query DefaultCurrencyQuery {
      allChannel(
        filter: { targetProduct: { eq: "vtex-storefront" } }
        limit: 1
      ) {
        edges {
          node {
            defaultCurrency
          }
        }
      }
    }
  `)

  const { defaultCurrency } = edges[0].node

  return usePersistedSearchParams(defaultCurrency, key)
}
