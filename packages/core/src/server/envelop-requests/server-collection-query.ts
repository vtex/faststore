import { gql } from '../../../@generated/gql'

import { ServerExecuteFunction } from '..'
import type {
  ServerCollectionPageQueryQuery,
  ServerCollectionPageQueryQueryVariables,
} from '../../../@generated/graphql'

export function serverCollectionRequest({
  slug,
}: ServerCollectionPageQueryQueryVariables) {
  return ServerExecuteFunction<
    ServerCollectionPageQueryQueryVariables,
    ServerCollectionPageQueryQuery
  >({
    variables: { slug },
    operation: query,
  })
}

const query = gql(`
  query ServerCollectionPageQuery($slug: String!) {
    ...ServerCollectionPage
    collection(slug: $slug) {
      seo {
        title
        description
      }
      breadcrumbList {
        itemListElement {
          item
          name
          position
        }
      }
      meta {
        selectedFacets {
          key
          value
        }
      }
    }
  }
`)
