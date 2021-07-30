import { readFileSync } from 'fs'
import { join } from 'path'

import slugify from 'slugify'
import type { ParentSpanPluginArgs } from 'gatsby'

import { PLUGIN } from '../../../constants'
import { fetchVTEX } from '../../../fetch'
import { api } from '../../../api'
import type { Brand, Category } from '../../../types'
import type { VTEXOptions as Options } from '../../../fetch'

type CollectionType = 'Department' | 'Category' | 'Brand' | 'Cluster'

export interface StoreCollection {
  id: string
  remoteId: string
  seo: {
    title: string
    description: string
  }
  slug: string
  parent?: string
  children?: string[]
  type: CollectionType
}

interface Config {
  gatsbyApi: ParentSpanPluginArgs
  options: Options
}

export const typeDefs = readFileSync(
  join(__dirname, '../src/graphql/types/collection/typeDefs.graphql')
).toString()

const typeName = `StoreCollection`

const createNodeId = (
  id: string,
  type: CollectionType,
  gatsbyApi: ParentSpanPluginArgs
) => gatsbyApi.createNodeId(`${typeName}:${type}:${id}`)

export const createNode = (
  gatsbyApi: ParentSpanPluginArgs,
  node: StoreCollection
) => {
  const id = createNodeId(node.id, node.type, gatsbyApi)
  const parentType = node.type === 'Category' ? 'Department' : node.type
  const childType = node.type === 'Department' ? 'Category' : node.type

  const data = {
    ...node,
    id,
    parent: node.parent && createNodeId(node.parent, parentType, gatsbyApi),
    children: node.children?.map((child) =>
      createNodeId(child, childType, gatsbyApi)
    ),
  }

  gatsbyApi.actions.createNode(
    {
      ...data,
      internal: {
        type: typeName,
        content: JSON.stringify(data),
        contentDigest: gatsbyApi.createContentDigest(data),
      },
    },
    { name: PLUGIN }
  )

  return id
}

const brandToStoreCollection = (node: Brand): StoreCollection => ({
  id: `${node.id}`,
  remoteId: `${node.id}`,
  seo: {
    title: node.title ?? '',
    description: node.metaTagDescription ?? '',
  },
  type: 'Brand',
  slug: slugify(node.name, { replacement: '-', lower: true }),
})

const categoryToStoreCollection = (
  node: Category,
  parent: string | undefined
): StoreCollection => ({
  id: `${node.id}`,
  remoteId: `${node.id}`,
  parent,
  children: node.children.map((child) => `${child.id}`),
  seo: {
    title: node.Title ?? '',
    description: node.MetaTagDescription ?? '',
  },
  type: parent === undefined ? 'Department' : 'Category',
  slug: new URL(node.url).pathname.slice(1),
})

export const fetchAllNodes = async ({
  gatsbyApi,
  options,
}: Config): Promise<StoreCollection[]> => {
  const activity = gatsbyApi.reporter.activityTimer(
    `[gatsby-source-vtex]: fetching Categories/Brands`
  )

  activity.start()

  const [tree, brands] = await Promise.all([
    fetchVTEX<Category[]>(api.catalog.category.tree(4), options),
    fetchVTEX<Brand[]>(
      api.catalog.brand.list({ page: 0, pageSize: 1000 }),
      options
    ),
  ])

  const collectionCategories: StoreCollection[] = []
  const dfs = (
    node: Category,
    collections: StoreCollection[],
    parent: string | undefined
  ) => {
    const collection = categoryToStoreCollection(node, parent)

    collections.push(collection)

    for (const child of node.children) {
      dfs(child, collections, `${node.id}`)
    }
  }

  for (const node of tree) {
    dfs(node, collectionCategories, undefined)
  }

  const collectionBrands = brands
    .filter((x) => x.isActive)
    .map(brandToStoreCollection)

  activity.end()

  return [...collectionCategories, ...collectionBrands]
}

export const sourceAllNodes = async (config: Config) => {
  const { gatsbyApi } = config

  const nodes = await fetchAllNodes(config)

  for (const node of nodes) {
    createNode(gatsbyApi, node)
  }
}
