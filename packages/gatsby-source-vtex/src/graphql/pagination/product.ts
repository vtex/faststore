import type { IPaginationAdapter } from 'gatsby-graphql-source-toolkit'

import type { Options } from '../../gatsby-node'

// Define pagination adapters
interface IProduct {
  productId: string
}

interface IPage {
  products: IProduct[]
}

// Current max page size supported by VTEX API
// TODO: Increasing this number could help on our build times
const PAGE_SIZE = 50

// VTEX Search API hard limits us to 2500 products at most
// Increasing this hard limit on the API may help us fetch more products
const MAX_PRODUCTS = 2500

export const ProductPaginationAdapter = ({
  minProducts = MAX_PRODUCTS,
}: Options): IPaginationAdapter<IPage, IProduct> => {
  const threshold = Math.min(minProducts, MAX_PRODUCTS)

  return {
    name: 'ProductPaginationAdapter',
    expectedVariableNames: [`from`, `to`],
    start: () => ({
      // Our search is inclusive, so 0 -> PAGE_SIZE - 1 fetches PAGE_SIZE items
      variables: { from: 0, to: PAGE_SIZE - 1 },
      hasNextPage: true,
    }),
    next: (state, page) => {
      const from = Number(state.variables.from) + PAGE_SIZE
      const to = Number(state.variables.to) + PAGE_SIZE

      return {
        variables: {
          from,
          to,
        },
        hasNextPage: page.products.length > 0 && to < threshold,
      }
    },
    concat: (result, page) => ({
      products: result.products.concat(page.products),
    }),
    getItems: (pageOrResult) => pageOrResult.products,
  }
}
