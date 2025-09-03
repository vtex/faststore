import { gql } from '../../../@generated'

import type {
  ClientProductCountQueryQuery as Query,
  ClientProductCountQueryQueryVariables as Variables,
} from '../../../@generated/graphql'
import { request } from '../graphql/request'

export const query = gql(`
  query ClientProductCountQuery($term: String) {
    productCount(term: $term) {
      total
    }
  }
`)

export const getProductCount = async (term?: string) => {
  const { productCount } = await request<Query, Variables>(query, { term })

  return productCount.total
}
