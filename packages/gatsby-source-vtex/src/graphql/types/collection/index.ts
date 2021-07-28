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

  const data = {
    ...node,
    id,
    parent: node.parent && createNodeId(node.parent, node.type, gatsbyApi),
    children: node.children?.map((child) =>
      createNodeId(child, node.type, gatsbyApi)
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

// TODO: Finish implementing fetchNodeChanges
// export interface NodeEvent {
//   eventName: 'DELETE' | 'UPDATE' | 'CREATE'
//   remoteId: {
//     type: 'Department' | 'Category' | 'Brand'
//     id: string
//   }
// }

// export const fetchNodeChanges = async (
//   options: Options,
//   events: { nodeEvents: NodeEvent[] }
// ): Promise<Array<StoreCollection | undefined>> => {
//   const [tree, brands] = await fetchData(options)

//   const treeMap = new Map<
//     string,
//     { node: Category; parent: string | undefined }
//   >()

//   const dfs = (node: Category, parent: string | undefined) => {
//     const id = node.id.toString()

//     treeMap.set(id, { node, parent })

//     node.children.forEach((child) => dfs(child, id))
//   }

//   tree.forEach((node) => dfs(node, undefined))

//   const fetchChange = async (
//     event: NodeEvent
//   ): Promise<StoreCollection | undefined> => {
//     if (event.eventName === 'DELETE') {
//       return undefined
//     }

//     if (event.remoteId.type === 'Category') {
//       const data = treeMap.get(event.remoteId.id)

//       if (!data) {
//         throw new Error('Error while updating catalog category tree data')
//       }

//       return categoryToStoreCollection(data.node, data.parent)
//     }

//     if (event.remoteId.type === 'Brand') {
//       const brand = brands.find((b) => `${b.id}` === event.remoteId.id)

//       if (!brand) {
//         throw new Error('Error while updating catalog brand data')
//       }

//       return brandToStoreCollection(brand)
//     }

//     throw new Error('Error while updating catalog data')
//   }

//   return pMap(events.nodeEvents, fetchChange, { concurrency: 20 })
// }

// /**
//  * This algorithm is split in two steps:
//  * 1. Touch all nodes
//  * 2. For updated/deleted nodes:
//  *  2.1 delete these touched nodes
//  *  2.2 if the node was updated, create a new node
//  */
// export const sourceNodeChanges = async (
//   config: Config,
//   events: { nodeEvents: NodeEvent[] }
// ) => {
//   const { gatsbyApi, options } = config

//   // Step1: Touch all StoreCollection nodes
//   const nodes = gatsbyApi.getNodesByType(typeName)

//   for (const node of nodes) {
//     gatsbyApi.actions.touchNode(node)
//   }

//   // Step2: Create/Delete nodes
//   const changes = await fetchNodeChanges(options, events)

//   for (let it = 0; it < changes.length; it++) {
//     const change = changes[it]
//     const event = events.nodeEvents[it]
//     const nodeId = createNodeId(
//       event.remoteId.id,
//       event.remoteId.type,
//       gatsbyApi
//     )

//     // Delete all nodes, even if it was updated
//     const node = gatsbyApi.getNode(nodeId)

//     if (node) {
//       gatsbyApi.actions.deleteNode(node)
//     }

//     // if the node was updated/created, create this new node
//     if (change !== undefined) {
//       createNode(gatsbyApi, change)
//     }
//   }
// }
