import type { IPaginationAdapter } from 'gatsby-graphql-source-toolkit'

// Define pagination adapters
interface IProduct {
  productId: string
}

interface IPage {
  products: IProduct[]
}

// Current max page size supported by VTEX API
// TODO: Increasing this number could help on our build times
const PAGE_SIZE = 100

export const ProductPaginationAdapter: IPaginationAdapter<IPage, IProduct> = {
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
      // VTEX Search API hard limits us to 2500 products at most
      hasNextPage: page.products.length > 0 && to < 2500,
    }
  },
  concat: (result, page) => ({
    products: result.products.concat(page.products),
  }),
  getItems: (pageOrResult) => pageOrResult.products,
}
