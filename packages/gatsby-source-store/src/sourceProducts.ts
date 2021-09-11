import type { SourceNodesArgs } from 'gatsby'

import { sourceStoreType } from './sourceStore'
import type { Options } from './gatsby-node'

export const sourceProducts = async (
  gatsbyApi: SourceNodesArgs,
  options: Options
) => {
  const { maxNumProducts = Infinity } = options
  const gatsbyNodeTypes = [
    {
      remoteTypeName: `StoreProduct`,
      queries: `
        query LIST_PRODUCTS($first: Int!, $after: String!) {
          allProducts(first: $first, after: $after) {
            edges {
              node {
                ..._ProductFragment_
              }
              cursor
            }
            pageInfo {
              hasNextPage
            }
          }
        }
        fragment _ProductFragment_ on StoreProduct {
          id: productID
          __typename
        }
      `,
    },
  ]

  await sourceStoreType({
    gatsbyApi,
    pluginOptions: options,
    gatsbyNodeTypes,
    maxItems: maxNumProducts,
  })
}
