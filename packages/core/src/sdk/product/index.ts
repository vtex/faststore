import { gql } from '../../../@generated'

import type {
  ClientProductCountQueryQuery as Query,
  ClientProductCountQueryQueryVariables as Variables,
} from '../../../@generated/graphql'
import { GraphqlRequest } from '../graphql/request'

export const query = gql(`
  query ClientProductCountQuery($term: String) {
    productCount(term: $term) {
      total
    }
  }
`)

export const getProductCount = async (term?: string) => {
  const { data } = await GraphqlRequest<Query, Variables>({
    operation: query,
    variables: { term },
  })

  return data?.productCount.total
}
