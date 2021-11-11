import type { SourceNodesArgs } from 'gatsby'

import { sourceStoreType } from './sourceStore'
import type { Options } from './index'

export const sourceCollections = async (
  gatsbyApi: SourceNodesArgs,
  options: Options,
  lastBuildTime?: number
) => {
  const { maxNumItems = Infinity } = options
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

  await sourceStoreType({
    gatsbyApi,
    pluginOptions: options,
    gatsbyNodeTypes,
    maxItems: maxNumItems,
    lastBuildTime,
  })
}
