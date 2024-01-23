import { enhanceSku } from '../utils/enhanceSku'
import type { Resolver } from '..'
import type { SearchArgs } from '../clients/search'
import type { Facet } from '../clients/search/types/FacetSearchResult'
import { ProductSearchResult } from '../clients/search/types/ProductSearchResult'
import { pickBestSku } from '../utils/sku'

export type Root = {
  searchArgs: Omit<SearchArgs, 'type'>
  productSearchPromise: Promise<ProductSearchResult>
}

const isRootFacet = (facet: Facet, isDepartment: boolean, isBrand: boolean) =>
  isDepartment
    ? facet.key === 'category-1'
    : isBrand
    ? facet.key === 'brand'
    : false

export const StoreSearchResult: Record<string, Resolver<Root>> = {
  suggestions: async (root, _, ctx) => {
    const {
      clients: { search },
    } = ctx

    const { searchArgs } = root

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

    const { productSearchPromise } = root
    const [terms, productSearchResult] = await Promise.all([
      search.suggestedTerms(searchArgs),
      productSearchPromise,
    ])

    const skus = productSearchResult.products
      .map((product) => {
        // What determines the presentation of the SKU is the price order
        // https://help.vtex.com/pt/tutorial/ordenando-imagens-na-vitrine-e-na-pagina-de-produto--tutorials_278
        const maybeSku = pickBestSku(product.items)

        return maybeSku && enhanceSku(maybeSku, product)
      })
      .filter((sku) => !!sku)

    const { searches } = terms

    return {
      terms: searches.map((item) => ({ value: item.term, count: item.count })),
      products: skus,
    }
  },
  products: async ({ productSearchPromise }) => {
    const productSearchResult = await productSearchPromise

    const skus = productSearchResult.products
      .map((product) => {
        // What determines the presentation of the SKU is the price order
        // https://help.vtex.com/pt/tutorial/ordenando-imagens-na-vitrine-e-na-pagina-de-produto--tutorials_278
        const maybeSku = pickBestSku(product.items)

        return maybeSku && enhanceSku(maybeSku, product)
      })
      .filter((sku) => !!sku)

    return {
      pageInfo: {
        hasNextPage: productSearchResult.pagination.after.length > 0,
        hasPreviousPage: productSearchResult.pagination.before.length > 0,
        startCursor: '0',
        endCursor: productSearchResult.recordsFiltered.toString(),
        totalCount: productSearchResult.recordsFiltered,
      },
      edges: skus.map((sku, index) => ({
        node: sku,
        cursor: index.toString(),
      })),
    }
  },
  facets: async ({ searchArgs }, _, ctx) => {
    const {
      clients: { search: is },
    } = ctx

    ctx.storage.searchArgs = searchArgs

    const { facets = [] } = await is.facets(searchArgs)

    const isCollectionPage = !searchArgs.query

    const isDepartment = searchArgs.selectedFacets?.length
      ? searchArgs.selectedFacets[0].key === 'category-1'
      : false

    const isBrand = searchArgs.selectedFacets?.length
      ? searchArgs.selectedFacets[0].key === 'brand'
      : false

    const filteredFacets = facets
      // Remove root facet on category and brand pages
      // TODO: Hide category filters for category pages. E.g. /office/desks
      .filter(
        (facet) =>
          !isCollectionPage || !isRootFacet(facet, isDepartment, isBrand)
      )

    return filteredFacets
  },
  metadata: async ({ searchArgs, productSearchPromise }) => {
    if (!searchArgs.query) {
      return null
    }

    const productSearchResult = await productSearchPromise
    return {
      isTermMisspelled: productSearchResult.correction?.misspelled ?? false,
      logicalOperator: productSearchResult.operator,
      fuzzy: productSearchResult.fuzzy,
    }
  },
}
