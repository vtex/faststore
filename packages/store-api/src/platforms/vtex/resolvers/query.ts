import { transformSelectedFacet } from '../utils/facets'
import { enhanceSku } from '../utils/enhanceSku'
import { SORT_MAP } from '../utils/sort'
import type { SelectedFacet } from '../utils/facets'
import type { CategoryTree } from '../clients/commerce/types/CategoryTree'
import type { Context } from '../index'

export interface SearchArgs {
  term?: string
  first: number
  after?: string
  sort:
    | 'price_desc'
    | 'price_asc'
    | 'orders_desc'
    | 'name_desc'
    | 'name_asc'
    | 'release_desc'
    | 'discount_desc'
    | 'score_desc'
  selectedFacets: SelectedFacet[]
}

export const Query = {
  product: async (
    _: unknown,
    { locator }: { locator: SelectedFacet[] },
    ctx: Context
  ) => {
    const {
      loaders: { skuLoader },
    } = ctx

    return skuLoader.load(locator.map(transformSelectedFacet))
  },
  search: async (
    _: unknown,
    { first, after: maybeAfter, sort, term, selectedFacets }: SearchArgs
  ) => {
    const after = maybeAfter ? Number(maybeAfter) : 0
    const searchArgs = {
      page: Math.ceil(after / first),
      count: first,
      query: term,
      sort: SORT_MAP[sort],
      selectedFacets: selectedFacets.map(transformSelectedFacet),
    }

    return searchArgs
  },
  allProducts: async (
    _: unknown,
    { first, after: maybeAfter }: { first: number; after: string | null },
    ctx: Context
  ) => {
    const {
      clients: { search },
    } = ctx

    const after = maybeAfter ? Number(maybeAfter) : 0
    const products = await search.products({
      page: Math.ceil(after / first),
      count: first,
    })

    const skus = products.products
      .map((product) => product.skus.map((sku) => enhanceSku(sku, product)))
      .flat()
      .filter((sku) => sku.sellers.length > 0)

    return {
      pageInfo: {
        hasNextPage: products.pagination.after.length > 0,
        hasPreviousPage: products.pagination.before.length > 0,
        startCursor: '0',
        endCursor: products.total.toString(),
        totalCount: products.total,
      },
      edges: skus.map((sku, index) => ({
        node: sku,
        cursor: (after + index).toString(),
      })),
    }
  },
  allCollections: async (_: unknown, __: unknown, ctx: Context) => {
    const {
      clients: { commerce },
    } = ctx

    const [brands, tree] = await Promise.all([
      commerce.catalog.brand.list(),
      commerce.catalog.category.tree(),
    ])

    const categories: Array<CategoryTree & { level: number }> = []
    const dfs = (node: CategoryTree, level: number) => {
      categories.push({ ...node, level })

      for (const child of node.children) {
        dfs(child, level + 1)
      }
    }

    for (const node of tree) {
      dfs(node, 0)
    }

    const collections = [
      ...brands.map((x) => ({ ...x, type: 'brand' })),
      ...categories,
    ]

    return {
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: '0',
        endCursor: '0',
      },
      edges: collections.map((node, index) => ({
        node,
        cursor: index.toString(),
      })),
    }
  },
}
