import { graphql, useStaticQuery } from 'gatsby'

import { usePersisted } from '../utils/persisted'

const key = 'currency'

export const useCurrency = () => {
  const {
    allChannel: { edges },
  } = useStaticQuery(graphql`
    query {
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
  const defaultCurrency = edges[0].node.defaultCurrency as string
  return usePersisted(defaultCurrency, key)
}
