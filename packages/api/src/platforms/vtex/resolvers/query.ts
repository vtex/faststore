import { enhanceSku } from '../utils/enhanceSku'
import { NotFoundError } from '../utils/errors'
import { transformSelectedFacet } from '../utils/facets'
import { SORT_MAP } from '../utils/sort'
import { StoreCollection } from './collection'
import type {
  QueryProductArgs,
  QueryAllCollectionsArgs,
  QueryAllProductsArgs,
  QuerySearchArgs,
  QueryCollectionArgs,
} from '../../../__generated__/schema'
import type { CategoryTree } from '../clients/commerce/types/CategoryTree'
import type { Context } from '../index'
import type { ValidPortalPagetype } from '../clients/commerce/types/Portal'

export const Query = {
  product: async (_: unknown, { locator }: QueryProductArgs, ctx: Context) => {
    // Insert channel in context for later usage
    ctx.storage = {
      ...ctx.storage,
      channel:
        locator.find((facet) => facet.key === 'channel')?.value ??
        ctx.storage.channel,
    }

    const {
      loaders: { skuLoader },
    } = ctx

    return skuLoader.load(locator.map(transformSelectedFacet))
  },
  collection: async (
    _: unknown,
    { slug }: QueryCollectionArgs,
    ctx: Context
  ) => {
    const {
      loaders: { pagetypeLoader },
    } = ctx

    const result = await pagetypeLoader.load(slug)

    const whitelist = ['Brand', 'Category', 'Department', 'Subcategory']

    if (whitelist.includes(result.pageType)) {
      return result as ValidPortalPagetype
    }

    throw new NotFoundError(`Not Found: ${slug}`)
  },
  search: async (
    _: unknown,
    { first, after: maybeAfter, sort, term, selectedFacets }: QuerySearchArgs,
    ctx: Context
  ) => {
    // Insert channel in context for later usage
    ctx.storage = {
      ...ctx.storage,
      channel:
        selectedFacets?.find((facet) => facet.key === 'channel')?.value ??
        ctx.storage.channel,
    }

    const after = maybeAfter ? Number(maybeAfter) : 0
    const searchArgs = {
      page: Math.ceil(after / first),
      count: first,
      query: term,
      sort: SORT_MAP[sort ?? 'score_desc'],
      selectedFacets: selectedFacets?.map(transformSelectedFacet) ?? [],
    }

    return searchArgs
  },
  allProducts: async (
    _: unknown,
    { first, after: maybeAfter }: QueryAllProductsArgs,
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
      // after + index is bigger than after+first itself because of the array flat() above
      edges: skus.map((sku, index) => ({
        node: sku,
        cursor: (after + index).toString(),
      })),
    }
  },
  allCollections: async (
    _: unknown,
    { first, after: maybeAfter }: QueryAllCollectionsArgs,
    ctx: Context
  ) => {
    const {
      clients: { commerce },
    } = ctx

    const after = maybeAfter ? Number(maybeAfter) : 0

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

    const validCollections = collections
      // Nullable slugs may cause one route to override the other
      .filter((node) => Boolean(StoreCollection.slug(node, null, ctx, null)))

    return {
      pageInfo: {
        hasNextPage: validCollections.length - after > first,
        hasPreviousPage: after > 0,
        startCursor: '0',
        endCursor: (
          Math.min(first, validCollections.length - after) - 1
        ).toString(),
      },
      edges: validCollections
        .slice(after, after + first)
        .map((node, index) => ({
          node,
          cursor: (after + index).toString(),
        })),
    }
  },
}
