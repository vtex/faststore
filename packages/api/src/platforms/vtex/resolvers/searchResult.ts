import { enhanceSku } from '../utils/enhanceSku'
import type { Resolver } from '..'
import type { SearchArgs } from '../clients/search'
import type { Facet } from '../clients/search/types/FacetSearchResult'

type Root = Omit<SearchArgs, 'type'>

const REMOVED_FACETS_FROM_COLLECTION_PAGE = ['departamento', 'Departamento']

export const StoreSearchResult: Record<string, Resolver<Root>> = {
  products: async (searchArgs, _, ctx) => {
    const {
      clients: { search },
    } = ctx

    const products = await search.products(searchArgs)

    const skus = products.products
      .map((product) => {
        const [maybeSku] = product.items

        return maybeSku && enhanceSku(maybeSku, product)
      })
      .filter((sku) => !!sku)

    return {
      pageInfo: {
        hasNextPage: products.pagination.after.length > 0,
        hasPreviousPage: products.pagination.before.length > 0,
        startCursor: '0',
        endCursor: products.recordsFiltered.toString(),
        totalCount: products.recordsFiltered,
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

    const { facets } = await is.facets(searchArgs)

    const isCollectionPage = !searchArgs.query
    const filteredFacets = facets?.reduce((acc, currentFacet) => {
      const shouldFilterFacet = REMOVED_FACETS_FROM_COLLECTION_PAGE.includes(
        currentFacet.name
      )

      const shouldRemoveFacetFromCollectionPage =
        isCollectionPage && shouldFilterFacet

      if (shouldRemoveFacetFromCollectionPage) {
        return acc
      }

      currentFacet.values.sort((a, b) => {
        const firstItemLabel = a.name ?? ''
        const secondItemLabel = b.name ?? ''

        return firstItemLabel.localeCompare(secondItemLabel)
      })

      acc.push(currentFacet)

      return acc
    }, [] as Facet[])

    return filteredFacets ?? []
  },
}
