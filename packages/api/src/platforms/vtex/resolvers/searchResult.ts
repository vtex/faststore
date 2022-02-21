import { enhanceSku } from '../utils/enhanceSku'
import type { Resolver } from '..'
import type { SearchArgs } from '../clients/search'
import type { Attribute } from '../clients/search/types/AttributeSearchResult'

type Root = Omit<SearchArgs, 'type'>
const FILTERED_FACETS_FROM_COLLECTION_PAGE = ['departamento']

export const StoreSearchResult: Record<string, Resolver<Root>> = {
  products: async (searchArgs, _, ctx) => {
    const {
      clients: { search },
    } = ctx

    const products = await search.products(searchArgs)

    const skus = products.products
      .map((product) => {
        const maybeSku = product.skus.find((x) => x.sellers.length > 0)

        return maybeSku && enhanceSku(maybeSku, product)
      })
      .filter((sku) => !!sku)

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
      clients: { search: is },
    } = ctx

    const facets = await is.facets(searchArgs)

    const isCollectionPage = !searchArgs.query
    const filteredFacets = facets?.attributes?.reduce((acc, currentFacet) => {
      const shouldFilterFacet = FILTERED_FACETS_FROM_COLLECTION_PAGE.includes(
        currentFacet.key
      )

      const shouldFilterFromCollectionPage =
        isCollectionPage && shouldFilterFacet

      const isText = currentFacet.type === 'text'

      if (shouldFilterFromCollectionPage || !isText) {
        return acc
      }

      currentFacet.values.sort((a, b) => {
        const firstItemLabel = a.label ?? ''
        const secondItemLabel = b.label ?? ''

        return firstItemLabel.localeCompare(secondItemLabel)
      })

      acc.push(currentFacet)

      return acc
    }, [] as Attribute[])

    return filteredFacets ?? []
  },
}
