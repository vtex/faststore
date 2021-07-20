import { readFileSync } from 'fs-extra'
import type { CreateNodeArgs } from 'gatsby'

import { brand } from '../../vtex-api/brand'
import { category } from '../../vtex-api/category'
import type { Options } from '../../gatsby-node'

export interface StoreCollection {
  id: string
  parent?: string
  seo: {
    title: string
    description: string
  }
  slug: string
  searchParams: {
    selectedFacets: Array<{ key: string; value: string }>
    orderBy: string
    from: number
    to: number
  }
}

/**
 * Definition of a Collection in the CMS
 */
export interface CMSCollection {
  href: string
  seo: {
    title: string
    description: string
  }
  ui: {
    columns: {
      desktop: number
      tablet: number
      mobile: number
    }
    lines: number
    orderBy:
      | 'price:desc'
      | 'price:asc'
      | 'orders:desc'
      | 'name:desc'
      | 'name:asc'
      | 'release:desc'
      | 'discount:desc'
      | ''
  }
  remoteId: {
    id: string
    entity: 'Category' | 'Brand' | 'Collection'
  }
}

const TYPENAME = 'StoreCollection'

export const typeDefs = readFileSync('./typeDefs.graphql').toString()

const createNodeId = (id: string, gatsbyApi: CreateNodeArgs) =>
  gatsbyApi.createNodeId(`${TYPENAME}:${id}`)

/** @description Create a single StoreCollection node */
export const sourceNode = (
  gatsbyApi: CreateNodeArgs,
  { collection }: { collection: StoreCollection }
) => {
  const data: StoreCollection = {
    ...collection,
    id: createNodeId(collection.id, gatsbyApi),
    parent: collection.parent && createNodeId(collection.parent, gatsbyApi),
  }

  gatsbyApi.actions.createNode({
    ...data,
    internal: {
      type: TYPENAME,
      content: JSON.stringify(data),
      contentDigest: gatsbyApi.createContentDigest(data),
    },
  })
}

type EventDelete = {
  eventName: 'DELETE'
  remoteId: string
}

type EventUpdate = {
  eventName: 'UPDATE'
  data: StoreCollection
}

type EventCreate = {
  eventName: 'CREATE'
  data: StoreCollection
}

type NodeEvent = EventDelete | EventUpdate | EventCreate

/**
 * @description Update previously sourced nodes and create new ones.
 * @example
 * const changedNodes = [
 *  {
 *    eventName: 'DELETE',
 *    remoteId: ...,
 *  },
 *  {
 *    eventName: 'UPDATE',
 *    data: {...}
 *  },
 *  {
 *    eventName: 'CREATE',
 *    data: {...}
 *  }
 * ]
 *
 * sourceNodeChanges(gatsbyApi, { nodeEvents })
 */
export const sourceNodeChanges = (
  gatsbyApi: CreateNodeArgs,
  { nodeEvents }: { nodeEvents: NodeEvent[] }
) => {
  const created = nodeEvents.filter(
    (x): x is EventCreate => x.eventName === 'CREATE'
  )

  const deleted = nodeEvents.filter(
    (x): x is EventDelete => x.eventName === 'DELETE'
  )

  const updated = nodeEvents.filter(
    (x): x is EventUpdate => x.eventName === 'UPDATE'
  )

  const deletedSet = new Set(
    deleted.map((x) => createNodeId(x.remoteId, gatsbyApi))
  )

  const updatedMap = updated.reduce((acc, cur) => {
    acc.set(createNodeId(cur.data.id, gatsbyApi), cur.data)

    return acc
  }, new Map<string, StoreCollection>())

  const nodes = gatsbyApi.getNodesByType('StoreCollection')

  /** Delete/Update/Touch previously fetched nodes */
  for (const node of nodes) {
    if (deletedSet.has(node.id)) {
      gatsbyApi.actions.deleteNode(node)

      continue
    }

    if (updatedMap.has(node.id)) {
      gatsbyApi.actions.deleteNode(node)
      sourceNode(gatsbyApi, { collection: updatedMap.get(node.id)! })
    }

    gatsbyApi.actions.touchNode(node)
  }

  /** Create new nodes */
  for (const node of created) {
    const { data } = node

    sourceNode(gatsbyApi, { collection: data })
  }
}

export const cmsToStore = async (
  collection: CMSCollection,
  options: Options
): Promise<StoreCollection> => {
  const base = {
    seo: collection.seo,
    slug: collection.href.slice(1), // removes the first '/'
    id: collection.remoteId.id,
  }

  const searchParams = {
    orderBy: collection.ui.orderBy,
    from: 0,
    to: collection.ui.columns.desktop * collection.ui.lines - 1,
  }

  if (collection.remoteId.entity === 'Category') {
    const data = await category.id(collection.remoteId.id, options)

    return {
      ...base,
      parent:
        typeof data.parentID === 'number' ? `${data.parentID}` : undefined,
      searchParams: {
        ...searchParams,
        selectedFacets: data.url
          .slice(1)
          .split('/')
          .map((x) => ({ key: 'c', value: x })),
      },
    }
  }

  if (collection.remoteId.entity === 'Brand') {
    const data = await brand.id(collection.remoteId.id, options)

    return {
      ...base,
      searchParams: {
        ...searchParams,
        selectedFacets: [{ key: 'b', value: data.name }],
      },
    }
  }

  return {
    ...base,
    searchParams: {
      ...searchParams,
      selectedFacets: [
        { key: 'productClusterId', value: collection.remoteId.id },
      ],
    },
  }
}
