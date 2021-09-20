import type { ParentSpanPluginArgs } from 'gatsby'

import { nodeId } from '../cms/sourceNode'
import type { RemotePageContent } from '../cms/types'
import type {
  ICollection,
  ICategoryCollection,
  IBrandCollection,
  IClusterCollection,
} from '../../native-types/blocks/collection'
import {
  isCategoryCollection,
  isBrandCollection,
  isClusterCollection,
} from '../../native-types/blocks/collection'

export type WithPLP<T> = T & { plp: string }

export const getCollectionsFromPageContent = (
  gatsbyApi: ParentSpanPluginArgs,
  nodes: RemotePageContent[]
) => {
  const collectionBlocks: Array<WithPLP<ICollection>> = []

  for (const node of nodes) {
    // We only allow plp content types
    if (node.type !== 'plp') {
      continue
    }

    for (const extraBlock of node.extraBlocks) {
      const block = extraBlock.blocks.find((x) => x.name === 'Collection')

      if (block) {
        const props = block.props as unknown as ICollection

        collectionBlocks.push({
          ...props,
          plp: gatsbyApi.createNodeId(nodeId(node)),
        })
      }
    }
  }

  return collectionBlocks
}

export const splitCollections = (collections: Array<WithPLP<ICollection>>) => ({
  categories: collections
    .filter((x): x is WithPLP<ICategoryCollection> => isCategoryCollection(x))
    .reduce(
      (acc, curr) => ({ ...acc, [curr.categoryId]: curr }),
      {} as Record<string, WithPLP<ICategoryCollection>>
    ),
  brands: collections
    .filter((x): x is WithPLP<IBrandCollection> => isBrandCollection(x))
    .reduce(
      (acc, curr) => ({ ...acc, [curr.brandId]: curr }),
      {} as Record<string, WithPLP<IBrandCollection>>
    ),
  clusters: collections
    .filter((x): x is WithPLP<IClusterCollection> => isClusterCollection(x))
    .reduce(
      (acc, curr) => ({ ...acc, [curr.clusterId]: curr }),
      {} as Record<string, WithPLP<IClusterCollection>>
    ),
})
