import { enhanceSku } from '../utils/enhanceSku'
import type { Resolver } from '..'
import type { SearchArgs } from '../clients/search'
import type { Facet } from '../clients/search/types/FacetSearchResult'

type Root = Omit<SearchArgs, 'type'>

const isRootFacet = (facet: Facet) => facet.key === 'category-1'

export const StoreSearchResult: Record<string, Resolver<Root>> = {
  suggestions: async (searchArgs, _, ctx) => {
    const {
      clients: { search },
    } = ctx

    // If there's no search query, suggest the most popular searches.
    if (!searchArgs.query) {
      const topSearches = await search.topSearches()

      return {
        terms: topSearches.searches.map((item) => ({
          value: item.term,
          count: item.count,
        })),
        products: [],
      }
    }

    const terms = await search.suggestedTerms(searchArgs)
    const products = await search.products(searchArgs)

    const skus = products.products
      .map((product) => {
        const [maybeSku] = product.items

        return maybeSku && enhanceSku(maybeSku, product)
      })
      .filter((sku) => !!sku)

    const { searches } = terms

    return {
      terms: searches.map((item) => ({ value: item.term, count: item.count })),
      products: skus,
    }
  },
  products: async (searchArgs, _, ctx) => {
    const {
      clients: { search, sp },
    } = ctx

    const products = await search.products(searchArgs)

    // Raise event on search's analytics API when performing
    // a full text search.
    if (searchArgs.query) {
      sp.sendEvent({
        type: 'search.query',
        text: searchArgs.query,
        misspelled: products.correction.misspelled,
        match: products.recordsFiltered,
        operator: products.operator,
      }).catch(console.error)
    }

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

    ctx.storage.searchArgs = searchArgs

    const { facets = [] } = await is.facets(searchArgs)

    const isCollectionPage = !searchArgs.query

    const filteredFacets = facets
      // Remove root facet on category pages
      .filter((facet) => !isCollectionPage || !isRootFacet(facet))

    return filteredFacets
  },
}
