import { join } from 'path'

import { outputJSON, pathExists } from 'fs-extra'
import { sourceStoreCollectionNode } from '@vtex/gatsby-source-vtex'
import type { JSONSchema6 } from 'json-schema'
import type {
  CreatePagesArgs,
  SourceNodesArgs,
  PluginOptionsSchemaArgs,
  CreateNodeArgs,
} from 'gatsby'
import type { StoreCollection } from '@vtex/gatsby-source-vtex'

import { Barrier } from './utils/barrier'
import { fetchAllNodes as fetchAllRemoteNodes } from './node-api/cms/fetchNodes'
import {
  createSchemaCustomization as createCmsSchemaCustomization,
  sourceNode as sourceCmsNode,
} from './node-api/cms/sourceNode'
import { fetchAllNodes as fetchAllLocalNodes } from './node-api/cms/sourceLocalNodes'
import {
  getCollectionsFromPageContent,
  splitCollections,
} from './node-api/catalog'
import type { WithPLP } from './node-api/catalog/index'
import type { BuilderConfig } from './index'
import type {
  ICategoryCollection,
  IClusterCollection,
  IBrandCollection,
} from './native-types/blocks/collection'

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
  itemsPerPage?: number
}

export const pluginOptionsSchema = ({ Joi }: PluginOptionsSchemaArgs) =>
  Joi.object({
    tenant: Joi.string().required(),
    workspace: Joi.string().required(),
    environment: Joi.string()
      .required()
      .valid('vtexcommercestable', 'vtexcommercebeta'),
    itemsPerPage: Joi.number(),
  })

interface CollectionsByType {
  Category: Record<string, WithPLP<ICategoryCollection>>
  Department: Record<string, WithPLP<ICategoryCollection>>
  Cluster: Record<string, WithPLP<IClusterCollection>>
  Brand: Record<string, WithPLP<IBrandCollection>>
}

const overridesBarrier = new Barrier<CollectionsByType>()

export const sourceNodes = async (
  gatsbyApi: SourceNodesArgs,
  options: Options
) => {
  // Warning: Do not source remote and local nodes in a different order since this
  // is important for the local nodes not to overrider remote ones
  const nodes = await Promise.all([
    fetchAllRemoteNodes(gatsbyApi, options),
    fetchAllLocalNodes(gatsbyApi),
  ]).then(([x, y]) => [...x, ...y].filter(Boolean))

  createCmsSchemaCustomization(gatsbyApi, nodes)

  for (const node of nodes) {
    sourceCmsNode(gatsbyApi, node)
  }

  /**
   * Add CMS overrides to StoreCollection Nodes
   */
  const collections = getCollectionsFromPageContent(gatsbyApi, nodes)
  const splitted = splitCollections(collections)

  overridesBarrier.set({
    Category: splitted.categories,
    Department: splitted.categories,
    Brand: splitted.brands,
    Cluster: splitted.clusters,
  })

  /**
   * Source StoreCollection from clusters. This part isn't done in
   * gatsby-source-vtex because collections do not have a defined
   * path on the store
   */
  for (const cluster of Object.values(splitted.clusters)) {
    const node: StoreCollection = {
      id: `${cluster.clusterId}:${cluster.seo.slug}`,
      remoteId: cluster.clusterId,
      slug: cluster.seo.slug,
      seo: {
        title: cluster.seo.title,
        description: cluster.seo.description,
      },
      type: 'Cluster',
      meta: {
        selectedFacets: [
          { key: 'productClusterIds', value: cluster.clusterId },
        ],
      },
    }

    sourceStoreCollectionNode(gatsbyApi, node)
  }
}

/**
 * @description
 * Create custom fields on StoreCollection when this collection is defined on the CMS
 */
export const onCreateNode = async (
  gatsbyApi: CreateNodeArgs,
  { itemsPerPage = 12 }: Options
) => {
  const { node } = gatsbyApi

  if (node.internal.type !== 'StoreCollection') {
    return
  }

  const collection = (node as unknown) as StoreCollection
  const overrides = await overridesBarrier.get()

  const override = overrides[collection.type][collection.remoteId]

  gatsbyApi.actions.createNodeField({
    node,
    name: 'searchParams',
    value: {
      sort: override?.sort === '""' ? '' : override?.sort ?? '',
      itemsPerPage,
      selectedFacets: collection.meta.selectedFacets,
    },
  })

  gatsbyApi.actions.createNodeField({
    node,
    name: `plp___NODE`,
    value: override?.plp ?? null,
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
