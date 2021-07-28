import { join } from 'path'

import { outputJSON, pathExists } from 'fs-extra'
import type { JSONSchema6 } from 'json-schema'
import type {
  CreatePagesArgs,
  SourceNodesArgs,
  PluginOptionsSchemaArgs,
  CreateNodeArgs,
} from 'gatsby'
import type { StoreCollection } from '@vtex/gatsby-source-vtex'
import { sourceStoreCollectionNode } from '@vtex/gatsby-source-vtex'

import type {
  IClusterCollection,
  IBrandCollection,
  ICategoryCollection,
} from './node-api/catalog/index'
import {
  isBrandCollection,
  isClusterCollection,
} from './node-api/catalog/index'
import { fetchAllNodes as fetchAllRemoteNodes } from './node-api/cms/fetchNodes'
import {
  createSchemaCustomization as createCmsSchemaCustomization,
  nodeId,
  sourceNode as sourceCmsNode,
} from './node-api/cms/sourceNode'
import { fetchAllNodes as fetchAllLocalNodes } from './node-api/cms/sourceLocalNodes'
import type { BuilderConfig } from './index'
import type { ICollection } from './native-types'
import { isCategoryCollection } from './native-types'

interface CMSContentType {
  id: string
  name: string
  beforeBlocks: Array<{ name: string; schema: JSONSchema6 }>
  afterBlocks: Array<{ name: string; schema: JSONSchema6 }>
  extraBlocks: Array<{
    name: string
    blocks: Array<{ name: string; schema: JSONSchema6 }>
  }>
}

interface CMSBuilderConfig {
  id: 'faststore'
  name: 'Powered by Gatsby Plugin CMS'
  productionBaseUrl: string
  blocks: Array<{ name: string; schema: JSONSchema6 }>
  contentTypes: CMSContentType[]
  messages: Record<string, string>
}

const { name } = require('./package.json')

const root = process.cwd()

const BUILDER_CONFIG_PATH = join(
  root,
  'public/page-data/_cms/builderConfig.json'
)

const SHADOWED_INDEX_PATH = join(root, 'src', name, 'index.ts')

export interface Options {
  tenant: string
  workspace: string
  environment: 'vtexcommercestable' | 'vtexcommercebeta'
  sourcingMode: 'cms-first' | 'catalog-first'
}

export const pluginOptionsSchema = ({ Joi }: PluginOptionsSchemaArgs) =>
  Joi.object({
    tenant: Joi.string().required(),
    workspace: Joi.string().required(),
    environment: Joi.string()
      .required()
      .valid('vtexcommercestable')
      .valid('vtexcommercebeta'),
    sourcingMode: Joi.string().valid('cms-first').valid('catalog-first'),
  })

type WithPLP<T> = T & { plp: string }

interface Overrides {
  Category: Record<string, WithPLP<ICategoryCollection>>
  Department: Record<string, WithPLP<ICategoryCollection>>
  Cluster: Record<string, WithPLP<IClusterCollection>>
  Brand: Record<string, WithPLP<IBrandCollection>>
}

let setOverrides: (value: Overrides) => void | undefined

const getOverrides = new Promise<Overrides>((resolve) => {
  setOverrides = resolve
})

export const sourceNodes = async (
  gatsbyApi: SourceNodesArgs,
  options: Options
) => {
  // Warning: Do not source remote and local nodes in a different order since this
  // is important for the local nodes not to overrider remote ones
  const cmsNodes = await Promise.all([
    fetchAllRemoteNodes(gatsbyApi, options),
    fetchAllLocalNodes(gatsbyApi),
  ]).then(([x, y]) => [...x, ...y])

  createCmsSchemaCustomization(gatsbyApi, cmsNodes)

  for (const node of cmsNodes) {
    sourceCmsNode(gatsbyApi, node)
  }

  /**
   * Add CMS overrides to StoreCollection Nodes
   */

  const collectionBlocks: Array<WithPLP<ICollection>> = []

  for (const node of cmsNodes) {
    for (const extraBlock of node.extraBlocks) {
      const block = extraBlock.blocks.find((x) => x.name === 'Collection')

      if (block) {
        const props = (block.props as unknown) as ICollection

        collectionBlocks.push({
          ...props,
          plp: gatsbyApi.createNodeId(nodeId(node)),
        })
      }
    }
  }

  const categories = collectionBlocks
    .filter((x): x is WithPLP<ICategoryCollection> => isCategoryCollection(x))
    .reduce(
      (acc, curr) => ({ ...acc, [curr.categoryId]: curr }),
      {} as Record<string, WithPLP<ICategoryCollection>>
    )

  const brands = collectionBlocks
    .filter((x): x is WithPLP<IBrandCollection> => isBrandCollection(x))
    .reduce(
      (acc, curr) => ({ ...acc, [curr.brandId]: curr }),
      {} as Record<string, WithPLP<IBrandCollection>>
    )

  const clusters = collectionBlocks
    .filter((x): x is WithPLP<IClusterCollection> => isClusterCollection(x))
    .reduce(
      (acc, curr) => ({ ...acc, [curr.clusterId]: curr }),
      {} as Record<string, WithPLP<IClusterCollection>>
    )

  setOverrides({
    Category: categories,
    Department: categories,
    Brand: brands,
    Cluster: clusters,
  })

  /**
   * Source StoreCollection from clusters. This part isn't done in
   * gatsby-source-vtex because collections do not have a defined
   * path on the store
   */
  for (const cluster of Object.values(clusters)) {
    const node: StoreCollection = {
      id: `${cluster.clusterId}:${cluster.seo.slug}`,
      remoteId: cluster.clusterId,
      slug: cluster.seo.slug,
      seo: {
        title: cluster.seo.title,
        description: cluster.seo.description,
      },
      type: 'Cluster',
    }

    sourceStoreCollectionNode(gatsbyApi, node)
  }

  // TODO: Implement cms-first schema
  if (options.sourcingMode === 'cms-first') {
    throw new Error('NotImplemented')
  }
}

const TypeKeyMap = {
  Cluster: 'productClusterIds',
  Brand: 'b',
  Category: 'c',
  Department: 'c',
}

export const onCreateNode = async (gatsbyApi: CreateNodeArgs) => {
  const { node } = gatsbyApi

  if (node.internal.type !== 'StoreCollection') {
    return
  }

  const collection = (node as unknown) as StoreCollection
  const overrides = await getOverrides

  const maybeOverride = overrides[collection.type][collection.remoteId]

  gatsbyApi.actions.createNodeField({
    node,
    name: 'searchParams',
    value: {
      sort: maybeOverride?.sort ?? '""',
      itemsPerPage: 12,
      selectedFacets:
        collection.type === 'Cluster'
          ? [{ key: TypeKeyMap.Cluster, value: collection.remoteId }]
          : collection.slug.split('/').map((segment) => ({
              key: TypeKeyMap[collection.type],
              value: segment,
            })),
    },
  })

  gatsbyApi.actions.createNodeField({
    node,
    name: `plp___NODE`,
    value: maybeOverride?.plp ?? null,
  })
}

export const createPages = async ({ graphql, reporter }: CreatePagesArgs) => {
  const { data, errors } = await graphql(`
    {
      site {
        siteMetadata {
          siteUrl
        }
      }
    }
  `)

  if (errors && errors.length > 0) {
    reporter.panicOnBuild(
      'Seomething went wrong while querying site metadata',
      errors
    )
  }

  const {
    site: {
      siteMetadata: { siteUrl },
    },
  }: { site: { siteMetadata: { siteUrl: string } } } = data as any

  // Read index.ts from shadowed plugin
  const exists = await pathExists(SHADOWED_INDEX_PATH)

  if (!exists) {
    return
  }

  // eslint-disable-next-line node/global-require
  require('@babel/register')({
    extensions: ['.ts'],
    presets: ['@babel/preset-typescript'],
  })
  const {
    builderConfig: {
      contentTypes: userContentTypes = {},
      blocks: userBlocks = {},
      messages = {},
    } = {},
    // eslint-disable-next-line node/global-require
  } = require(SHADOWED_INDEX_PATH) as {
    builderConfig: BuilderConfig
  }

  const blocks = Object.keys(userBlocks).map((blockName) => ({
    name: blockName,
    schema: userBlocks[blockName],
  }))

  // Transform all contentTypes into CMS contentTypes format
  const contentTypes = Object.keys(userContentTypes).reduce(
    (acc, contentTypeName) => {
      const contentType = userContentTypes[contentTypeName]

      const beforeBlocks = Object.keys(contentType.beforeBlocks).map(
        (blockName) => ({
          name: blockName,
          schema: contentType.beforeBlocks[blockName],
        })
      )

      const afterBlocks = Object.keys(contentType.afterBlocks).map(
        (blockName) => ({
          name: blockName,
          schema: contentType.afterBlocks[blockName],
        })
      )

      const extraBlocks = Object.keys(contentType.extraBlocks).map(
        (sectionName) => ({
          name: sectionName,
          blocks: Object.keys(contentType.extraBlocks[sectionName]).map(
            (blockName) => ({
              name: blockName,
              schema: contentType.extraBlocks[sectionName][blockName],
            })
          ),
        })
      )

      acc.push({
        ...contentType,
        id: contentTypeName,
        beforeBlocks,
        afterBlocks,
        extraBlocks,
      })

      return acc
    },
    [] as CMSContentType[]
  )

  const builderConfig: CMSBuilderConfig = {
    id: 'faststore',
    name: 'Powered by Gatsby Plugin CMS',
    productionBaseUrl: siteUrl,
    contentTypes,
    blocks,
    messages,
  }

  await outputJSON(BUILDER_CONFIG_PATH, builderConfig)
}
