import { join } from 'path'
import { readFileSync } from 'fs'

import type { SourceNodesArgs } from 'gatsby'
import slugify from 'slugify'

import { api } from '../../../api'
import { fetchVTEX } from '../../../fetch'
import { PLUGIN } from '../../../constants'
import type { Options } from '../../../gatsby-node'
import type { Brand, Category, Sort } from '../../../types'

interface Collection {
  seo: {
    title: string
    description: string
  }
  name: string
  slug: string
  remoteId: string
  children: string[]
  /**
   * Search Args.
   * TODO: Maybe we can get rid of this?
   */
  searchParams: {
    from: number
    to: number
    selectedFacets: Array<{ key: string; value: string }>
    orderBy: Sort
  }
}

export const NODE_TYPE = 'StoreCollection'

export const typeDefs = readFileSync(
  join(__dirname, '../src/graphql/types/collection/typedefs.graphql')
).toString()

const DEFAULT_SEARCH_PARAMS = {
  from: 0,
  to: 11,
  orderBy: '',
} as const

const gatsbySlugify = (term: string) =>
  slugify(term, {
    replacement: '-',
    lower: true,
    strict: true,
  })

const categoryToCollection = (item: Category) => {
  const href = new URL(item.url).pathname

  return {
    seo: {
      title: item.Title ?? '',
      description: item.MetaTagDescription ?? '',
    },
    name: item.name ?? '',
    slug: gatsbySlugify(href),
    remoteId: item.id.toString(),
    children: item.children.map((x) => `${x.id}`),
    searchParams: {
      ...DEFAULT_SEARCH_PARAMS,
      selectedFacets: href
        .split('/')
        .slice(1)
        .map((x) => ({ key: 'c', value: x })),
    },
  }
}

const brandToCollection = (item: Brand) => ({
  seo: {
    title: item.title ?? '',
    description: item.metaTagDescription ?? '',
  },
  name: item.name,
  slug: gatsbySlugify(item.name),
  remoteId: item.id.toString(),
  children: [],
  searchParams: {
    ...DEFAULT_SEARCH_PARAMS,
    selectedFacets: [{ key: 'b', value: item.name }],
  },
})

const createNode = (
  { actions, createNodeId, createContentDigest }: SourceNodesArgs,
  collection: Collection,
  parent: null | { id: number }
) => {
  const getNodeId = (id: string | number) => createNodeId(`${NODE_TYPE}-${id}`)

  const data = {
    ...collection,
    id: getNodeId(collection.remoteId),
    parent: parent && getNodeId(parent.id),
    children: collection.children.map(getNodeId),
  }

  actions.createNode(
    {
      ...data,
      internal: {
        type: NODE_TYPE,
        content: JSON.stringify(data),
        contentDigest: createContentDigest(data),
      },
    },
    PLUGIN
  )
}

export const sourceAllNodes = async (
  gatsbyApi: SourceNodesArgs,
  options: Options
) => {
  const sourceAllCategories = async () => {
    const tree = await fetchVTEX<Category[]>(
      api.catalog.category.tree(4),
      options
    )

    const dfs = (
      node: Category,
      parent: Category | null,
      seen: Set<number>
    ) => {
      if (seen.has(node.id)) {
        return
      }

      createNode(gatsbyApi, categoryToCollection(node), parent)

      for (const child of node.children) {
        dfs(child, node, seen)
      }
    }

    const seen = new Set<number>()

    for (const root of tree) {
      dfs(root, null, seen)
    }
  }

  const sourceAllBrands = async () => {
    const brands = await fetchVTEX<Brand[]>(
      api.catalog.brand.list({ page: 0, pageSize: 1000 }),
      options
    )

    for (const brand of brands) {
      if (!brand.isActive) {
        continue
      }

      createNode(gatsbyApi, brandToCollection(brand), null)
    }
  }

  await Promise.all([sourceAllCategories(), sourceAllBrands()])
}

/** TODO: add a way of actually sourcing changes */
export const sourceNodeChanges = async (
  gatsbyApi: SourceNodesArgs,
  _: Options
) => {
  const nodes = gatsbyApi.getNodesByType(NODE_TYPE)

  for (const node of nodes) {
    gatsbyApi.actions.touchNode(node)
  }
}
