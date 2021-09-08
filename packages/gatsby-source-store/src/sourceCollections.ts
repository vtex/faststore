import type { SourceNodesArgs } from 'gatsby'

import { sourceStoreType } from './sourceStore'
import type { Options } from './gatsby-node'

export const sourceCollections = async (
  gatsbyApi: SourceNodesArgs,
  options: Options
) => {
  const { maxNumCollections = Infinity } = options
  const gatsbyNodeTypes = [
    {
      remoteTypeName: `StoreCollection`,
      queries: `
        query LIST_COLLECTIONS($first: Int!, $after: String!) {
          allCollections(first: $first, after: $after) {
            edges {
              node {
                ..._CollectionFragment_
              }
              cursor
            }
            pageInfo {
              hasNextPage
            }
          }
        }
        fragment _CollectionFragment_ on StoreCollection {
          id
          __typename
        }
      `,
    },
  ]

  await sourceStoreType(gatsbyApi, options, gatsbyNodeTypes, maxNumCollections)
}
