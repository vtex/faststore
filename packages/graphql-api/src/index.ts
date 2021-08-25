import axios from 'axios'

export const schema = `
  type Query {
    products(from: Int, to: Int): [Product!]!
    product(id: ID!): Product
  }

  type Product {
    id: ID!
    name: String!
  }
`

interface VtexOptions {
  environment: string
  tenant: string
}

interface VtexProduct {
  productId: string
  productName: string
}

const getSearchUrl = ({ environment, tenant }: VtexOptions) =>
  `http://${tenant}.${environment}.com.br/api/catalog_system/pub/products/search`

const fetchProductById = async (options: VtexOptions, id: string) => {
  const API_ENDPOINT = getSearchUrl(options)

  return axios.get(API_ENDPOINT, { params: { fq: `productId:${id}` } })
}

const fetchTopSellingProducts = async (
  options: VtexOptions,
  from?: number,
  to?: number
) => {
  const API_ENDPOINT = getSearchUrl(options)

  return axios.get(API_ENDPOINT, {
    params: { _from: from, _to: to, O: 'OrderByTopSaleDESC' },
  })
}

export const getGraphQLConfig = (options: VtexOptions) => {
  return {
    schema,
    resolvers: {
      Query: {
        products: async (
          root: null,
          { from, to }: { from: number; to: number }
        ) => {
          const response = await fetchTopSellingProducts(options, from, to)

          return response.data
        },
        product: async (root: null, { id }: { id: string }) => {
          const response = await fetchProductById(options, id)

          return response.data[0]
        },
      },
      Product: {
        id: (root: VtexProduct) => root.productId,
        name: (root: VtexProduct) => root.productName,
      },
    },
  }
}
