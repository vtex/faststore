import type { IPaginationAdapter } from 'gatsby-graphql-source-toolkit'

// Define pagination adapters
interface IProduct {
  productId: string
}

interface IPage {
  products: IProduct[]
}

export const ProductPaginationAdapter: IPaginationAdapter<IPage, IProduct> = {
  name: 'ProductPaginationAdapter',
  expectedVariableNames: [`from`, `to`],
  start: () => ({
    variables: { from: 0, to: 99 },
    hasNextPage: true,
  }),
  next: (state, page) => {
    const from = Number(state.variables.from) + 100
    const to = Number(state.variables.to) + 100

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
