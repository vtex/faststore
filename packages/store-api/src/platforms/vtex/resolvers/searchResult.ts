import { enhanceSku } from '../utils/enhanceSku'
import type { Resolver } from '..'
import type { SearchArgs } from '../clients/is'

type Root = Omit<SearchArgs, 'type'>

export const StoreSearchResult: Record<string, Resolver<Root>> = {
  products: async (searchArgs, _, ctx) => {
    const {
      clients: { is },
    } = ctx

    const products = await is.products(searchArgs)

    const skus = products.products.map((product) => {
      const [sku] = product.skus

      return enhanceSku(sku, product)
    })

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
        cursor: index.toString(),
      })),
    }
  },
  facets: async (searchArgs, _, ctx) => {
    const {
      clients: { is },
    } = ctx

    const facets = await is.facets(searchArgs)

    return facets.attributes
  },
}
