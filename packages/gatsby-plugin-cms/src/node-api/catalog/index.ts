import type { ParentSpanPluginArgs } from 'gatsby'

import type { TransformedContent } from '../cms/fetchNodes'
import { nodeId } from '../cms/sourceNode'
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
  nodes: TransformedContent[]
) => {
  const collectionBlocks: Array<WithPLP<ICollection>> = []

  for (const node of nodes) {
    // We only allow plp content types
    if (node.contentType.id !== 'plp') {
      continue
    }

    for (const extraBlock of node.variant.configurationDataSets) {
      const block = extraBlock.configurations.find(
        (x) => x.name === 'Collection'
      )

      if (block) {
        const props = (block.props as unknown) as ICollection

        collectionBlocks.push({
          ...props,
          plp: gatsbyApi.createNodeId(nodeId(node)),
        })
      }
    }
  }

  return collectionBlocks
}

export const getCollectionRemoteId = (cluster: IClusterCollection) =>
  `${cluster.clusterId}:${cluster.seo.slug}`

export const splitCollections = (collections: Array<WithPLP<ICollection>>) => ({
  categories: collections
    .filter((x): x is WithPLP<ICategoryCollection> => isCategoryCollection(x))
    .reduce((acc, curr) => {
      const id = curr.categoryId

      if (acc[id]) {
        console.warn(
          `[gatsby-plugin-cms]: You have two or more pages on your cms pointing to the same Category(${id}). Delete one of them to avoid conflicts`
        )
      }

      return { ...acc, [id]: curr }
    }, {} as Record<string, WithPLP<ICategoryCollection>>),
  brands: collections
    .filter((x): x is WithPLP<IBrandCollection> => isBrandCollection(x))
    .reduce((acc, curr) => {
      const id = curr.brandId

      if (acc[id]) {
        console.warn(
          `[gatsby-plugin-cms]: You have two or more pages on your cms pointing to the same Brand(${id}). Delete one of them to avoid conflicts`
        )
      }

      return { ...acc, [id]: curr }
    }, {} as Record<string, WithPLP<IBrandCollection>>),
  clusters: collections
    .filter((x): x is WithPLP<IClusterCollection> => isClusterCollection(x))
    .reduce((acc, curr) => {
      const id = getCollectionRemoteId(curr)

      if (acc[id]) {
        console.warn(
          `[gatsby-plugin-cms]: You have two or more pages on your cms pointing to the same Collection(${id}). Delete one of them to avoid conflicts`
        )
      }

      return { ...acc, [id]: curr }
    }, {} as Record<string, WithPLP<IClusterCollection>>),
})
