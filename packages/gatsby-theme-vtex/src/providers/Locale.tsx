import { graphql, useStaticQuery } from 'gatsby'

import { usePersisted } from '../utils/persisted'

const key = 'locale'

export const useLocale = () => {
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
            defaultLocale
          }
        }
      }
    }
  `)
  const defaultLocale = edges[0].node.defaultLocale as string
  return usePersisted(defaultLocale, key)
}
