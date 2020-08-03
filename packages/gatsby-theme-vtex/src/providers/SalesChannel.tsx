import { graphql, useStaticQuery } from 'gatsby'

import { usePersisted } from '../utils/persisted'

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
  const [salesChannel, setSalesChannel] = usePersisted(defaultSalesChannel, key)

  return [Number(salesChannel), setSalesChannel]
}
