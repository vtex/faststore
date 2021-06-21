import type { IPaginationAdapter } from 'gatsby-graphql-source-toolkit'

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
  next: (state, page) => ({
    variables: {
      from: Number(state.variables.from) + 100,
      to: Number(state.variables.to) + 100,
    },
    hasNextPage: page.products.length > 0,
  }),
  concat: (result, page) => ({
    products: result.products.concat(page.products),
  }),
  getItems: (pageOrResult) => pageOrResult.products,
}
