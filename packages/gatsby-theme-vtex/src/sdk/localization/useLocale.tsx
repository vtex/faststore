import { graphql, useStaticQuery } from 'gatsby'

import { usePersistedSearchParams } from '../state/usePersistedSearchParams'

const key = 'locale'

export const useLocale = () => {
  const {
    allChannel: { edges },
  } = useStaticQuery(graphql`
    query DefaultLocaleQuery {
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

  return usePersistedSearchParams(defaultLocale, key)
}
