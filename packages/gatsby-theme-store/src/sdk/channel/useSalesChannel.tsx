import { graphql, useStaticQuery } from 'gatsby'

import { usePersistedSearchParams } from '../state/usePersistedSearchParams'

const key = 'sc'

export const useSalesChannel = (): [number, typeof setSalesChannel] => {
  const {
    allChannel: { edges },
  } = useStaticQuery(graphql`
    query DefaultSalesChannelQuery {
      allChannel(
        filter: { targetProduct: { eq: "vtex-storefront" } }
        limit: 1
      ) {
        edges {
          node {
            salesChannel
          }
        }
      }
    }
  `)

  const defaultSalesChannel = edges[0].node.salesChannel as string
  const [salesChannel, setSalesChannel] = usePersistedSearchParams(
    defaultSalesChannel,
    key
  )

  return [Number(salesChannel), setSalesChannel]
}
